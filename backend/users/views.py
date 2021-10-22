from django.contrib.auth.models import Group
from users.serializers.user_emails import CreateUserEmailSerializer
from providers.serializers.providers import CreateProviderSerializer
from clients.serializers.ranch import CreateRanchSerializer
from clients.serializers.client import CreateClientSerializer
from users.serializers.profile import CreateProfileSerializer
from users.serializers.users import CreateUserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)
from django.db import IntegrityError, transaction
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from backend.utils.permissions import IsAdmin


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["id"] = user.pk
        token["first_name"] = user.first_name
        token["groups"] = list(user.groups.values_list('name', flat=True))
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenObtainPairSerializer


class CreateUser(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        try:
            with transaction.atomic():
                payload = self.request.data
                group = self.request.data["group"]
                user_serializer = CreateUserSerializer(data=payload["user"])
                if not user_serializer.is_valid():
                    raise IntegrityError(user_serializer.errors)
                user = user_serializer.save()

                # Add user to group
                my_group = Group.objects.get(name=group)
                user.groups.add(my_group)

                # Create profile
                profile_serializer = CreateProfileSerializer(
                    data=payload["profile"]
                )
                if not profile_serializer.is_valid():
                    return Response(
                            profile_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST
                            )
                profile_serializer.save(
                    user=user
                )

                if group == "Cliente":
                    client_serializer = CreateClientSerializer(
                        data=payload["client"]
                    )
                    if not client_serializer.is_valid():
                        raise IntegrityError(client_serializer.errors)

                    client = client_serializer.save(
                        user=user
                    )
                    if payload["ranchs"] and len(payload["ranchs"]) > 0:
                        ranch_serializer = CreateRanchSerializer(
                            data=payload["ranchs"],
                            many=True
                        )
                        if not ranch_serializer.is_valid():
                            raise IntegrityError(ranch_serializer.errors)

                        ranch_serializer.save(
                            client=client
                        )
                elif group == "Proveedor":
                    provider_serializer = CreateProviderSerializer(
                        data=payload["provider"]
                    )
                    if not provider_serializer.is_valid():
                        raise IntegrityError(provider_serializer.errors)

                    provider_serializer.save(
                        user=user
                    )
                if payload["emails"] and len(payload["emails"]) > 0:
                    email_serializer = CreateUserEmailSerializer(
                        data=payload["emails"],
                        many=True
                    )
                    if not email_serializer.is_valid():
                        raise IntegrityError(email_serializer.errors)

                    email_serializer.save(
                        user=user
                    )
                return Response(
                    {'User created succesfully.'},
                    status=status.HTTP_201_CREATED
                )
        except IntegrityError as e:
            return Response(
                    str(e),
                    status=status.HTTP_400_BAD_REQUEST
                )
