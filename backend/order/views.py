from order.models import Order, Requisition
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from .serializers import OrderSerializer, RequisitionSerializer


class ListAllRequisitions(generics.ListAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()


class CreateOrder(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
