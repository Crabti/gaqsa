from rest_framework import serializers
from clients.models import Client


class CreateClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        exclude = ('id', 'user')


class UpdateClientSerialzier(serializers.ModelSerializer):
    class Meta:
        model = Client
        exclude = ('id', 'user', 'created_at', 'updated_at')
        extra_kwargs = {
            'rfc': {'validators': []},
        }


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
