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
from products.serializers.laboratory import (
    LaboratorySerializer,
    ListLaboratorySerializer
)
from products.serializers.category import (
    CategorySerializer,
    ListCategorySerializer
)
from products.models import AnimalGroup, Category, Laboratory, Product
from providers.models import Provider

from products.serializers.product import (
    CreateProductAsAdminSerializer, CreateProductSerializer,
    ListProductSerializer, ProductSerializer, UpdateProductPrice,
    UpdateProductSerializer
)

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status


class ListProductView(generics.ListAPIView):
    serializer_class = ListProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']

    def get_queryset(self):
        if is_provider(self.request.user):
            provider = Provider.objects.get(user=self.request.user)
            return Product.objects.filter(provider=provider)
        else:
            return Product.objects.all()


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

    def post(self, request: Request) -> Response:
        token = request.data["token"]

        provider = Provider.objects.filter(user=request.user.pk).first()
        if not provider or provider.token_used or provider.token != token:
            return Response(
                data={"code": "INVALID_TOKEN"},
                status=status.HTTP_400_BAD_REQUEST
            )

        products = request.data["products"]
        for product in products:
            pk = product["product"]
            new_price = product["new_price"]
            if new_price and pk:
                data = {
                    "price": new_price,
                }

                product = Product.objects.get(pk=pk)

                serializer = UpdateProductPrice(instance=product, data=data)

                if not serializer.is_valid():
                    return Response(
                        data=serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                serializer.save()

        provider.token_used = True
        provider.updated_at = datetime.utcnow()
        provider.save()

        return Response(data={}, status=status.HTTP_200_OK)


class CreateLaboratoryView(generics.CreateAPIView):
    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer


class ListLaboratoryView(generics.ListAPIView):
    queryset = Laboratory.objects.all()
    serializer_class = ListLaboratorySerializer


class CreateCategoryView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ListCategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = ListCategorySerializer
