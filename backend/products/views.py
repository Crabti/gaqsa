from datetime import datetime

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.utils.permissions import IsProvider
from products.serializers.animal_group import ListAnimalGroupSerializer
from drf_multiple_model.views import ObjectMultipleModelAPIView
from products.serializers.laboratory import ListLaboratorySerializer
from products.serializers.category import ListCategorySerializer
from products.models import AnimalGroup, Category, Laboratory, Product
from providers.models import Provider

from products.serializers.product import (
    CreateProductSerializer, ListProductSerializer, ProductSerializer,
    UpdateProductSerializer, CreateChangePriceRequest
)

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status


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


class RequestPriceChange(APIView):
    permission_classes = [IsProvider]

    def patch(self, request: Request) -> Response:
        token = request.data["token"]

        provider = Provider.objects.filter(user=request.user.pk).first()

        if not provider or provider.token_used or provider.token != token:
            return Response(data={}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            "new_price": request.data["price"],
            "provider": provider.pk,
            "product": request.data["product"],
        }

        serializer = CreateChangePriceRequest(data=data)

        if not serializer.is_valid():
            return Response(
                data=serializer.errors, status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()
        provider.token_used = True
        provider.updated_at = datetime.utcnow()
        provider.save()

        return Response(data=serializer.data, status=status.HTTP_201_CREATED)
