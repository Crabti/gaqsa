from http import HTTPStatus

from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["POST"])
def request_product(request):
    return Response({}, status=HTTPStatus.CREATED)
