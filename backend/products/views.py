from http import HTTPStatus
from products.models import Product

from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from products.serializers.product import (
    CreateProductSerializer, ProductSerializer
)


@api_view(["POST"])
def request_product(request: Request) -> Response:
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
    }

    serializer = CreateProductSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTPStatus.CREATED)
    return Response(serializer.errors, status=HTTPStatus.BAD_REQUEST)


@api_view(["GET"])
def list_pending_products(request: Request) -> Response:
    products = Product.objects.filter(status=Product.PENDING)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def list_all_products(request: Request, pk: int) -> Response:
    products = Product.objects.filter(provider=pk, status=Product.ACCEPTED)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)