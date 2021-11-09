from __future__ import annotations

from datetime import date, datetime

from backend.utils.groups import is_admin, is_provider
from backend.utils.permissions import IsAdmin, IsProvider
from backend.utils.product_key import create_product_key

from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from products.mails import (
    send_mail_on_create_product_request,
    send_mail_on_price_change, send_mail_on_reject_product
)
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
from products.models import (
    AnimalGroup, Category, Laboratory, Product, ProductProvider
)
from providers.models import Provider

from products.serializers.product import (
    AcceptProductSerializer,
    CreateProductSerializer,
    ListProductSerializer, ListProviderProductsSerializer,
    ProductSerializer,
    RejectProductSerializer, UpdateProductPrice,
    UpdateProductProviderSerializer,
    UpdateProductSerializer,
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
            return Product.objects.filter(
                productprovider__provider=provider
            )
        else:
            return Product.objects.all()

    def get_serializer_class(self):
        if is_provider(self.request.user):
            return ListProviderProductsSerializer
        else:
            return ListProductSerializer


class CreateProductView(generics.CreateAPIView):
    permission_classes = (IsProvider | IsAdmin, )  # type: ignore

    def post(self, request: Request) -> Response:
        # Create key from data
        key = create_product_key(
            self.request.data['category'], self.request.data['name']
        )
        data = self.request.data

        if is_provider(self.request.user):
            provider = Provider.objects.get(
                user=self.request.user
            )
            data['provider']['provider'] = provider.id
        else:
            provider = Provider.objects.get(pk=data['provider']['provider'])
        serializer = CreateProductSerializer(
            data=data,
        )
        if not serializer.is_valid():
            return Response(
                data=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        if is_admin(self.request.user):
            product = serializer.save(key=key, status=Product.ACCEPTED)
        else:
            product = serializer.save(key=key)
        product_provider = ProductProvider.objects.filter(
            provider=provider, product=product
        ).last()
        send_mail_on_create_product_request(product_provider)
        return Response(
            data=serializer.data, status=status.HTTP_201_CREATED
        )


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


class AcceptProductAsNew(APIView):
    permission_classes = (IsAdmin, )

    def post(self, request: Request) -> Response:
        for data in request.data:
            id = data['id']
            request = Product.objects.get(pk=id)
            if not request:
                return Response(
                    data={"code": "PRODUCT_REQUEST_NOT_FOUND"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serializer = AcceptProductSerializer(
                instance=request,
                data={
                    'status': Product.ACCEPTED,
                },
                partial=True
            )
            if not serializer.is_valid():
                return Response(
                    data=serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )
            product = serializer.save()

            # At this point in time, new product should only have one provider
            product_provider = product.providers.first()
            if product_provider:
                serializer = UpdateProductProviderSerializer(
                    product_provider,
                    data=data,
                    partial=True,
                )
                if not serializer.is_valid():
                    return Response(
                        data=serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                serializer.save()
        return Response(
            data={'code': 'PRODUCTS_ACCEPTED'},
            status=status.HTTP_200_OK
        )


class GroupProductsView(APIView):
    permission_classes = (IsAdmin, )

    def post(self, request: Request) -> Response:
        data = request.data
        target = Product.objects.get(pk=data['product'])
        if not target:
            return Response(
                data={"code": "TARGET_PRODUCT_NOT_FOUND"},
                status=status.HTTP_400_BAD_REQUEST
            )
        for data in data['providers']:
            id = data['id']
            product_provider = ProductProvider.objects.get(pk=id)
            if not product_provider:
                return Response(
                    data={"code": "PRODUCT_PROVIDER_NOT_FOUND"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Update fields if passed
            serializer = UpdateProductProviderSerializer(
                product_provider,
                data=data,
                partial=True,
            )
            if not serializer.is_valid():
                return Response(
                    data=serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # Change relation to target
            instance = serializer.save()

            # Change state of old product instance
            instance.product.status = Product.INACTIVE
            instance.product.save()
            instance.product = target
            instance.save()

        return Response(
            data={'code': 'PRODUCTS_GROUPED'},
            status=status.HTTP_200_OK
        )


class RejectProductsView(APIView):
    permission_classes = (IsAdmin, )

    def post(self, request: Request) -> Response:
        products = request.data['products']
        reject_reason = request.data['reject_reason']
        mail_data = []
        for product in products:
            product = Product.objects.get(pk=product)
            if not product:
                return Response(
                    data={"code": "PRODUCT_REQUEST_NOT_FOUND"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serializer = RejectProductSerializer(
                instance=product,
                data={
                    'status': Product.REJECTED,
                    'reject_reason': reject_reason
                },
                partial=True
            )
            if not serializer.is_valid():
                return Response(
                    data=serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )
            product = serializer.save()

            mail_data.append(product)
        send_mail_on_reject_product(mail_data)
        return Response(
            data={'code': 'PRODUCTS_REJECTED'}, status=status.HTTP_200_OK
        )


class RequestPriceChange(APIView):
    permission_classes = [IsProvider]

    def post(self, request: Request) -> Response:
        token = request.data["token"]

        provider = Provider.objects.filter(user=request.user.pk).first()
        if (not provider or provider.token_used or
                provider.token != token or
                provider.token_apply_date != date.today()):
            return Response(
                data={"code": "INVALID_TOKEN"},
                status=status.HTTP_400_BAD_REQUEST
            )

        results = []
        products = request.data["products"]
        for product in products:
            pk = product["product"]
            if 'new_price' not in product or product["new_price"] is None:
                continue

            new_price = product["new_price"]
            if new_price and pk:
                data = {
                    "price": new_price,
                }
                product_provider = ProductProvider.objects.filter(
                    product=pk,
                    provider=provider
                ).last()
                old_price = product_provider.price

                serializer = UpdateProductPrice(
                    instance=product_provider, data=data
                )

                if not serializer.is_valid():
                    return Response(
                        data=serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                instance = serializer.save()
                new_result = instance.product
                new_result.price = instance.price
                new_result.laboratory = instance.laboratory
                new_result.old_price = old_price
                new_result.price_diff = new_result.price - new_result.old_price

                new_result.diff_percentage = (
                    new_result.price - new_result.old_price
                ) / 2

                results.append(new_result)

        provider.token_used = True
        provider.updated_at = datetime.utcnow()
        provider.save()

        send_mail_on_price_change(
           products=results, provider=provider
        )

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
