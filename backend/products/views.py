from http import HTTPStatus
from products.models import Product
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from products.serializers.product import (
    CreateProductSerializer, ProductSerializer,
    UpdateProductSerializer
)

from products.filters import ProductFilter
from django_filters.utils import translate_validation


@api_view(["POST", "GET"])
def products(request: Request) -> Response:
    if request.method == 'POST':
        data = {
            "key": request.data.get("key"),
            "name": request.data.get("name"),
            "dose": request.data.get("dose"),
            "presentation": request.data.get("presentation"),
            "iva": request.data.get("iva"),
            "price": request.data.get("price"),
            "more_info": request.data.get("more_info"),
            "is_generic": request.data.get("is_generic"),
            "provider": request.data.get("provider"),
            "status": Product.PENDING,
        }

        serializer = CreateProductSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTPStatus.CREATED)
        return Response(serializer.errors, status=HTTPStatus.BAD_REQUEST)
    elif request.method == 'GET':
        queryset = Product.objects.all()
        filterset = ProductFilter(request.GET, queryset=queryset)
        if not filterset.is_valid():
            raise translate_validation(filterset.errors)
        serializer = ProductSerializer(filterset.qs, many=True)
        return Response(serializer.data)


@api_view(["PUT", "GET"])
def product_detail(request: Request, *args, **kwargs) -> Response:
    if request.method == 'PUT':
        pk = kwargs.get("pk")
        product = get_object_or_404(Product, pk=pk)
        data = {
            "key": request.data.get("key"),
            "name": request.data.get("name"),
            "dose": request.data.get("dose"),
            "presentation": request.data.get("presentation"),
            "iva": request.data.get("iva"),
            "price": request.data.get("price"),
            "more_info": request.data.get("more_info"),
            "is_generic": request.data.get("is_generic"),
            "provider": request.data.get("provider"),
            "status": request.data.get("status")
        }

        serializer = UpdateProductSerializer(instance=product, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTPStatus.OK)
        print(serializer.errors)
        return Response(serializer.errors, status=HTTPStatus.BAD_REQUEST)

    elif request.method == 'GET':
        pk = kwargs.get("pk")
        product = get_object_or_404(Product, pk=pk)

        serializer = ProductSerializer(product)

        return Response(serializer.data, status=HTTPStatus.OK)
