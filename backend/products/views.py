from products.models import Product

from products.serializers.product import (
    CreateProductSerializer, ProductSerializer,
    UpdateProductSerializer
)

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics


class ListProductView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['provider', 'status']


class CreateProductView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = CreateProductSerializer


class UpdateProductView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = UpdateProductSerializer


class RetrieveProductView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
