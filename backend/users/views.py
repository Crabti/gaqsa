from http import HTTPStatus

from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group, User
from rest_framework.request import Request

from backend.utils.constants import CLIENT_GROUP, PROVIDER_GROUP, ADMIN_GROUP
from users.serializers.user_emails import CreateUserEmailSerializer
from providers.serializers.providers import CreateProviderSerializer
from clients.serializers.ranch import CreateRanchSerializer
from clients.serializers.client import CreateClientSerializer
from users.serializers.profile import CreateProfileSerializer
from users.serializers.users import (
    CreateUserSerializer,
    ListUserSerializer,
    UserIsActiveSerializer,
    UserSerializer, ClientUserSerializer, ProviderUserSerializer,
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)
from django.db import IntegrityError, transaction
from rest_framework.response import Response
from rest_framework import status, generics, serializers
from rest_framework.views import APIView
from backend.utils.permissions import IsAdmin, IsOwnUserOrAdmin


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["id"] = user.pk
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name
        token["username"] = user.username
        token["groups"] = list(user.groups.values_list('name', flat=True))
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenObtainPairSerializer


class ListUserView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    queryset = User.objects.all()
    serializer_class = ListUserSerializer


class RetrieveUserView(APIView):
    @staticmethod
    def get_user_response(
        user: User, serializer,
    ) -> Response:
        user_serializer = serializer(user)
        response = user_serializer.data
        return Response(response, status=status.HTTP_200_OK)

    def get(self, request: Request, pk: int) -> Response:
        """
        Returns user information.
        Validates the user's role and returns the corresponding data.
        """
        curr_user_groups = [g.name for g in request.user.groups.all()]
        if (not request.user.pk == pk) and (ADMIN_GROUP not in curr_user_groups):
            return Response({"code": "FORBIDDEN"}, status=status.HTTP_403_FORBIDDEN)

        user = User.objects.filter(pk=pk).first()
        if not user:
            return Response({"code": "NOT_FOUND"}, status=status.HTTP_404_NOT_FOUND)

        user_role = user.groups.all()[0].name
        if user_role == PROVIDER_GROUP:
            return self.get_user_response(user, ProviderUserSerializer)
        if user_role == ADMIN_GROUP:
            return self.get_user_response(user, UserSerializer)
        if user_role == CLIENT_GROUP:
            return self.get_user_response(user, ClientUserSerializer)

        return Response({"code": "BAD_REQUEST"}, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserActiveView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAdmin]
    lookup_field = 'pk'
    serializer_class = UserIsActiveSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data
        serializer = self.get_serializer(instance, data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'code': 'UPDATED_USER_ACTIVE'}, HTTPStatus.OK)
        else:
            return Response(
                {
                    'code': 'UPDATE_USER_ACTIVE_FAILED',
                    'errors': serializer.errors
                },
                HTTPStatus.BAD_REQUEST
            )


class CreateUser(APIView):
    permission_classes = [IsAdmin]

    def client_save(self, user, payload):
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

    def provider_save(self, user, payload):
        provider_serializer = CreateProviderSerializer(
            data=payload["provider"]
        )
        if not provider_serializer.is_valid():
            raise IntegrityError(provider_serializer.errors)

        provider_serializer.save(
            user=user
        )

    def emails_save(self, user, payload):
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

    def save_user(self, payload):
        # Encrypt password
        payload["user"]["password"] = make_password(
            payload["user"]["password"]
        )
        user_serializer = CreateUserSerializer(data=payload["user"])
        if not user_serializer.is_valid():
            raise IntegrityError(user_serializer.errors)
        return user_serializer.save()

    def save_group(self, user, payload):
        group = payload["group"]
        my_group = Group.objects.get(name=group)
        user.groups.add(my_group)
        return group

    def save_profile(self, user, payload):
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

    def post(self, request):
        try:
            with transaction.atomic():
                payload = self.request.data

                existing_user = User.objects.filter(
                    username=payload["user"]["username"],
                ).first()

                if existing_user:
                    return Response(
                        {"code": "USER_ALREADY_EXISTS"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                user = self.save_user(payload)
                group = self.save_group(user, payload)
                self.save_profile(user, payload)

                if group == CLIENT_GROUP:
                    self.client_save(user, payload)
                elif group == PROVIDER_GROUP:
                    self.provider_save(user, payload)
                if group == PROVIDER_GROUP or group == CLIENT_GROUP:
                    self.emails_save(user, payload)
                return Response(
                    {'User created succesfully.'},
                    status=status.HTTP_201_CREATED
                )
        except IntegrityError as e:
            return Response(
                    str(e),
                    status=status.HTTP_400_BAD_REQUEST
                )
