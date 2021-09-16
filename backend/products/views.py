from http import HTTPStatus

from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from products.serializers.product import CreateProductSerializer


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
    }

    serializer = CreateProductSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=HTTPStatus.CREATED)
    return Response(serializer.errors, status=HTTPStatus.BAD_REQUEST)
