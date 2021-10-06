from providers.models import Provider
from backend.utils.groups import is_client, is_provider
from order.models import Order, Requisition
from rest_framework import generics
from .serializers import (
    ListRequisitionSerializer, OrderSerializer, ListOrderSerializer)
from django.shortcuts import get_object_or_404


class ListOrders(generics.ListAPIView):
    serializer_class = ListOrderSerializer

    def get_queryset(self):
        if is_client(self.request.user):
            return Order.objects.filter(user=self.request.user)
        else:
            return Order.objects.all()


class CreateOrder(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class ListRequisitions(generics.ListAPIView):
    serializer_class = ListRequisitionSerializer

    def get_queryset(self):
        if is_provider(self.request.user):
            provider = get_object_or_404(Provider, user=self.request.user)
            return Requisition.objects.filter(provider=provider)
        else:
            return Requisition.objects.all()
