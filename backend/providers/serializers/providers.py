from rest_framework import serializers
from providers.models import Provider


class ProviderPkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = (
            "pk",
        )


class ListProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = '__all__'


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = '__all__'


class CreateCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = (
            "token",
            "token_used"
        )


class CreateProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        exclude = ('id', 'user')
