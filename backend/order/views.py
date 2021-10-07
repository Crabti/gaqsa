from providers.models import Provider
from backend.utils.groups import is_client, is_provider
from order.models import Order, Requisition
from rest_framework import generics, status
from .serializers import (
    ListRequisitionSerializer, OrderSerializer, ListOrderSerializer, CreateRequisitionSerializer)
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


class CreateOrder(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def prev_save(self, obj):
        print(self.request)
        obj.user = self.request.user.pk


class CreateOrder2(APIView):
    def post(self, request):
        print(request.data)
        print(request.user)
        order_serializer = OrderSerializer(data={"user": request.user.pk})
        if not order_serializer.is_valid():
            return Response(order_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        new_order = order_serializer.save()

        data=[]

        for product in request.data['products']:
            data.append({ 
                'order': new_order.pk,
                'provider': Product.objects.get(pk=product['product']['id']).provider.id,
                'product': product['product']['id'],
                'quantity_requested': product['amount'],
                'price': float(product['product']['price'])
            })
            print(data)
        
        requisition_serializer = CreateRequisitionSerializer(data=data, many=True)
        if not requisition_serializer.is_valid():
            return Response(requisition_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        requisition_serializer.save()

        return Response(order_serializer.data, status=status.HTTP_201_CREATED)
        
            


class ListRequisitions(generics.ListAPIView):
    serializer_class = ListRequisitionSerializer

    def get_queryset(self):
        if is_provider(self.request.user):
            provider = get_object_or_404(Provider, user=self.request.user)
            return Requisition.objects.filter(provider=provider)
        else:
            return Requisition.objects.all()
