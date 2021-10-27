from clients.serializers.client import ClientSerializer
from providers.serializers.providers import ProviderSerializer
from rest_framework import serializers
from django.contrib.auth.models import Group, User


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('name',)


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "username",
            "password",
            "email",
            "first_name",
            "last_name"
        )


class ListUserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name',
    )

    provider = ProviderSerializer(read_only=True, allow_null=True)
    provider = ClientSerializer(read_only=True, allow_null=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "last_login",
            "date_joined",
            "groups",
            "is_active",
            "provider",
            "client"
        )
