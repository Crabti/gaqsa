from clients.models import Ranch
from rest_framework import serializers


class CreateRanchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ranch
        fields = (
            "key",
            "name",
        )
