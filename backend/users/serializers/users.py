from clients.serializers.client import ClientSerializer, UpdateClientSerialzier
from providers.serializers.providers import (
    ProviderSerializer, UpdateProviderSerializer
)
from rest_framework import serializers
from django.contrib.auth.models import Group, User
from django.core.exceptions import ObjectDoesNotExist

from ..models import Profile


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


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ("telephone",)


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name',
    )

    class Meta:
        model = User
        fields = (
            "id",
            "groups",
            "username",
            "first_name",
            "last_name",
            "profile",
            "email",
        )


class ClientUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    client = ClientSerializer(read_only=True)
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name',
    )

    class Meta:
        model = User
        fields = (
            "id",
            "groups",
            "username",
            "first_name",
            "last_name",
            "email",
            "profile",
            "client",
        )


class ProviderUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    provider = ProviderSerializer(read_only=True)
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name',
    )

    class Meta:
        model = User
        fields = (
            "id",
            "groups",
            "username",
            "first_name",
            "last_name",
            "email",
            "profile",
            "provider",
        )


class ListUserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name',
    )

    provider = ProviderSerializer(read_only=True, allow_null=True)
    client = ClientSerializer(read_only=True, allow_null=True)

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


class UserIsActiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('is_active', 'pk')


class UpdateUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(allow_null=True, write_only=True)
    client = UpdateClientSerialzier(
        allow_null=True, write_only=True, required=False
    )
    provider = UpdateProviderSerializer(
        allow_null=True, write_only=True, required=False
    )

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "profile",
            "client",
            "provider",
        )

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        profile_serializer = self.fields['profile']
        try:
            if profile_data:
                profile_serializer.update(
                    instance.profile, profile_data
                )
        except ObjectDoesNotExist:
            Profile.objects.create(
                user=instance,
                **profile_data,
            )
        client_data = validated_data.pop('client', None)
        client_serializer = self.fields['client']
        try:
            if client_data:
                client_serializer.update(
                    instance.client, client_data
                )
        except ObjectDoesNotExist:
            pass
        provider_data = validated_data.pop('provider', None)
        provider_serializer = self.fields['provider']
        try:
            if provider_data:
                provider_serializer.update(
                    instance.provider, provider_data
                )
        except ObjectDoesNotExist:
            pass
        return super(UpdateUserSerializer, self).update(
            instance, validated_data
        )
