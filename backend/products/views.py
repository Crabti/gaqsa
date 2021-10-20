from __future__ import annotations

from datetime import datetime
from backend.utils.groups import is_admin, is_provider
from backend.utils.permissions import IsAdmin, IsProvider
from backend.utils.product_key import create_product_key

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from products.serializers.animal_group import ListAnimalGroupSerializer
from drf_multiple_model.views import ObjectMultipleModelAPIView
from products.serializers.laboratory import ListLaboratorySerializer
from products.serializers.category import ListCategorySerializer
from products.models import AnimalGroup, Category, Laboratory, Product
from providers.models import Provider

from products.serializers.product import (
    CreateProductAsAdminSerializer, CreateProductSerializer,
    ListProductSerializer, ProductSerializer,
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
    permission_classes = (IsProvider | IsAdmin, )  # type: ignore

    # Get product provider from request user if user is provider.
    def perform_create(self, serializer):
        # Create key from data
        key = create_product_key(
            self.request.data['category'], self.request.data['name']
        )
        if is_provider(self.request.user):
            provider = Provider.objects.get(user=self.request.user)
            serializer.save(provider=provider, key=key)
        elif is_admin(self.request.user):
            serializer.save(status=Product.ACCEPTED, key=key)

    def get_serializer_class(self):
        if is_provider(self.request.user):
            return CreateProductSerializer
        else:
            return CreateProductAsAdminSerializer


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

    def patch(self, request: Request, pk: int) -> Response:
        token = request.data["token"]

        provider = Provider.objects.filter(user=request.user.pk).first()

        if not provider or provider.token_used or provider.token != token:
            return Response(data={}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            "new_price": request.data["price"],
            "provider": provider.pk,
            "product": pk,
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
