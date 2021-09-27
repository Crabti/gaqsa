from order.models import Order
from rest_framework import generics
from .serializers import OrderSerializer


class ListOrders(generics.ListAPIView):
    serializer_class = OrderSerializer
    queryset = Order.objects.all()


class CreateOrder(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
