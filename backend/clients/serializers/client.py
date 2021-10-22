from rest_framework import serializers
from clients.models import Client


class CreateClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        exclude = ('id', 'user')
