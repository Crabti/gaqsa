from http import HTTPStatus
from backend.utils.permissions import IsOwnProviderOrAdmin, IsOwnerOrAdmin
from order.mails import (
    send_mail_to_client_on_create_order,
    send_mail_to_provider_on_create_order,
    send_main_on_cancel_order
)
from products.models import ProductProvider
from providers.models import Provider
from backend.utils.groups import is_client, is_provider
from order.models import Order, Requisition
from rest_framework import generics, status
from .serializers import (
    CancelOrderSerializer, CreateOrderSerializer, ListRequisitionSerializer,
    OrderPreviewSerializer, ListOrderSerializer,
    RetrieveOrderSerializer, UpdateOrderQuantitySerializer
)
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request


class ListOrders(generics.ListAPIView):
    serializer_class = ListOrderSerializer

    def get_queryset(self):
        if is_client(self.request.user):
            return Order.objects.filter(user=self.request.user)
        elif is_provider(self.request.user):
            provider = Provider.objects.get(user=self.request.user)
            return Order.objects.filter(provider=provider)
        else:
            return Order.objects.all()


class OrderPreview(APIView):
    def post(self, request):
        product_providers = request.data
        data = []
        total = 0
        subtotal = 0
        ieps_total = 0
        iva_total = 0

        for product_provider in product_providers:
            try:
                found: ProductProvider = ProductProvider.objects.get(
                    pk=product_provider["id"]
                )
            except ProductProvider.DoesNotExist:
                continue
            quantity = int(product_provider["quantity"])
            if quantity is None or quantity <= 0:
                quantity = 1
            temp_total = found.calculate_total(quantity)
            temp_subtotal = found.calculate_subtotal(quantity)
            temp_ieps = found.calculate_ieps(quantity)
            temp_iva = found.calculate_iva(quantity)

            total += temp_total
            subtotal += temp_subtotal
            ieps_total += temp_ieps
            iva_total += temp_iva
            offer = found.get_offer
            if offer:
                original_price = found.price
            else:
                original_price = None

            data.append({
                "id": found.id,
                "quantity": quantity,
                "total": temp_total,
                "subtotal": temp_subtotal,
                "iva_total": temp_iva,
                "ieps_total": temp_ieps,
                "price": found.current_price,
                "original_price": original_price,
                "name": found.product.name,
                "provider": found.provider.name,
                "presentation": found.product.presentation,
                "lab": found.laboratory,
                "category": found.product.category,
            })
        serializer = OrderPreviewSerializer({
            "total": total,
            "subtotal": subtotal,
            "iva_total": iva_total,
            "ieps_total": ieps_total,
            "products": data,
        })
        return Response(serializer.data, status=HTTPStatus.OK)


class CreateOrder(APIView):
    def parse_data(self, data) -> "dict[int, list]":
        provider_dict = {}
        for product in data:
            quantity = int(product["quantity"])
            if quantity is None or quantity <= 0:
                quantity = 1
            try:
                product_provider = ProductProvider.objects.get(
                    pk=product["id"]
                )
            except ProductProvider.DoesNotExist:
                continue
            product_data = {
                "id": product_provider.product.id,
                "quantity": quantity,
                "price": product_provider.calculate_total(quantity)
            }
            provider_id = product_provider.provider.id
            if provider_id not in provider_dict:
                provider_dict[provider_id] = []
            provider_dict[provider_id].append(product_data)
        return provider_dict

    def post(self, request: Request) -> Response:
        data = request.data
        if not data:
            return Response(
                {
                    "detail": "No data provided",
                    "code": "EMPTY_PAYLOAD",
                },
                status=HTTPStatus.BAD_REQUEST,
            )
        provider_dict = self.parse_data(data)
        orders = []
        for provider, products in provider_dict.items():
            requisition_data = []
            for product in products:
                requisition_data.append({
                    "quantity_requested": product["quantity"],
                    "product": product["id"],
                    "price": product["price"],
                })
            order_serializer = CreateOrderSerializer(
                data={
                    "user": request.user.pk,
                    "provider": provider,
                    "requisitions": requisition_data,
                }
            )
            if not order_serializer.is_valid():
                return Response(
                    order_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )
            order = order_serializer.save()
            orders.append(order)
        send_mail_to_client_on_create_order(orders)
        send_mail_to_provider_on_create_order(orders)
        return Response(
            {"detail": "Order created succesfully!"},
            status=status.HTTP_201_CREATED
        )


class ListRequisitions(generics.ListAPIView):
    serializer_class = ListRequisitionSerializer

    def get_queryset(self):
        if is_provider(self.request.user):
            provider = get_object_or_404(Provider, user=self.request.user)
            return Requisition.objects.filter(provider=provider)
        else:
            return Requisition.objects.all()


class RetrieveOrderView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = RetrieveOrderSerializer


class UpdateOrderRequisitionsView(generics.UpdateAPIView):
    permission_classes = [IsOwnProviderOrAdmin]
    serializer_class = UpdateOrderQuantitySerializer
    lookup_field = 'pk'
    queryset = Order.objects.all()

    def update(self, request: Request, *args, **kwargs) -> Response:
        self.get_object()
        for data in request.data:
            requisition: Requisition = Requisition.objects.get(
                pk=data['requisition']
            )
            if not requisition:
                return Response(
                    {"code": "REQUISIITON NOT FOUND"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serializer = self.get_serializer(
                requisition,
                data=data,
                partial=True
            )

            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class CancelOrderClient(generics.UpdateAPIView):
    permission_classes = [IsOwnerOrAdmin]
    queryset = Order.objects.all()
    serializer_class = CancelOrderSerializer

    def update(self, request: Request, *args, **kwargs) -> Response:
        self.get_object()
        order: Order = Order.objects.get(pk=self.kwargs['pk'])
        serializer = self.get_serializer(
            order,
            data=request.data,
            partial=True
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()
        send_main_on_cancel_order(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
