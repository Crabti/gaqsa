from http import HTTPStatus
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.request import Request
from backend.utils.permissions import IsOwnerOrAdmin, IsProvider
from offers.models import Offer
from offers.serializers.offer import (
    CancelOfferSerializer, CreateOfferSerializer
)
from rest_framework import generics


class CreateOfferView(generics.CreateAPIView):
    queryset = Offer.objects.all()
    serializer_class = CreateOfferSerializer
    permission_classes = [IsProvider]

    # Save request user
    def perform_create(self, serializer):
        user = User.objects.get(pk=self.request.user.pk)
        serializer.save(user=user)


class CancelOfferView(generics.UpdateAPIView):
    permission_classes = [IsOwnerOrAdmin]
    serializer_class = CancelOfferSerializer
    lookup_field = 'pk'
    queryset = Offer.objects.all()

    def update(self, request: Request, *args, **kwargs) -> Response:
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data={'cancelled': True},
            partial=True
        )
        if not serializer.is_valid():
            return Response(
                serializer.errors, HTTPStatus.BAD_REQUEST
            )
        serializer.save()
        return Response(
            serializer.data,
            status=HTTPStatus.OK,
        )
