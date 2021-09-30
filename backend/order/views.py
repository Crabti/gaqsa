from backend.utils.groups import is_client
from order.models import Order
from rest_framework import generics
from .serializers import OrderSerializer, ListOrderSerializer


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
