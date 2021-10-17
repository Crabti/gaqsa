# from django.http import request
from order.mails import (
    send_mail_on_create_order, send_mail_on_create_order_user)
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
from products.models import Product


class ListOrders(generics.ListAPIView):
    serializer_class = ListOrderSerializer

    def get_queryset(self):
        if is_client(self.request.user):
            return Order.objects.filter(user=self.request.user)
        else:
            return Order.objects.all()


class CreateOrder(APIView):
    def post(self, request):
        order_serializer = OrderSerializer(
            data={"user": request.user.pk}
            )
        if not order_serializer.is_valid():
            return Response(
                order_serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )
        new_order = order_serializer.save()

        data = []
        providers = []
        products = []

        for product in request.data['products']:
            id_provider = product['product']['provider']
            data.append({
                'order': new_order.pk,
                'provider': Product.objects.get(
                    pk=product['product']['id']
                    ).provider.id,
                'product': product['product']['id'],
                'quantity_requested': product['amount'],
                'price': float(product['product']['price'])
            })
            products.append(product)
            if id_provider not in providers:
                providers.append(id_provider)

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
            new_order, providers, request.user, request.data['products']
            )
        send_mail_on_create_order_user(
            new_order, request.user, request.data['products']
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
