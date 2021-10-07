from products.serializers.animal_group import ListAnimalGroupSerializer
from drf_multiple_model.views import ObjectMultipleModelAPIView
from products.serializers.laboratory import ListLaboratorySerializer
from products.serializers.category import ListCategorySerializer
from products.models import AnimalGroup, Category, Laboratory, Product
from providers.models import Provider

from products.serializers.product import (
    CreateProductSerializer, ListProductSerializer, ProductSerializer,
    UpdateProductSerializer
)

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics


class ListProductView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ListProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['provider', 'status']


class CreateProductView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = CreateProductSerializer

    # Get product provider from request user
    def perform_create(self, serializer):
        provider = Provider.objects.get(user=self.request.user)
        serializer.save(provider=provider)


class UpdateProductView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = UpdateProductSerializer


class RetrieveProductView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ListProductSelectOptions(ObjectMultipleModelAPIView):
    querylist = [
        {
            'queryset': Category.objects.all(),
            'serializer_class': ListCategorySerializer,
            'label': 'categories',
        },
        {
            'queryset': Laboratory.objects.all(),
            'serializer_class': ListLaboratorySerializer,
            'label': 'laboratories',
        },
        {
            'queryset': AnimalGroup.objects.all(),
            'serializer_class': ListAnimalGroupSerializer,
            'label': 'animal_groups',
        },
    ]
