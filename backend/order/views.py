# from django.http import request
from order.mails import (
    send_mail_on_create_order, send_mail_on_create_order_user)
from products.models import ProductProvider
from providers.models import Provider
from backend.utils.groups import is_client, is_provider
from order.models import Order, Requisition
from rest_framework import generics, status
from .serializers import (
    ListRequisitionSerializer, OrderSerializer,
    ListOrderSerializer, CreateRequisitionSerializer
    )
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response


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


class CreateOrder(APIView):

    def post(self, request):

        providers = []
        products = request.data['productsSh']
        print(products)
        for product in products:
            relation = ProductProvider.objects.get(pk=product['product']['id'])
            provider_id = relation.provider.id
            if provider_id not in providers:
                providers.append(provider_id)

        for provider in providers:
            # TODO: Create orders by providers
            order_serializer = OrderSerializer(
                data={
                    "user": request.user.pk,
                    "provider": provider
                    }
            )
            if not order_serializer.is_valid():
                return Response(
                    order_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )
            new_order = order_serializer.save()

            data = []
            productOrder = []
            for product in products:
                relation = ProductProvider.objects.get(
                    pk=product['product']['id']
                    )
                if relation.provider.id == provider:
                    data.append({
                        'order': new_order.pk,
                        'product': relation.product.id,
                        'quantity_requested': product['amount'],
                        'price': float(product['product']['price'])
                    })
                    productOrder.append({
                        'product': product['product'],
                        'amount': product['amount']
                    })

            print(data)
            requisition_serializer = CreateRequisitionSerializer(
                data=data, many=True
                )
            if not requisition_serializer.is_valid():
                return Response(
                    requisition_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                    )

            requisition_serializer.save()

            send_mail_on_create_order(
                new_order, productOrder
            )
            send_mail_on_create_order_user(
                new_order, productOrder
            )

        return Response(order_serializer.data, status=status.HTTP_201_CREATED)


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
    serializer_class = ListOrderSerializer
