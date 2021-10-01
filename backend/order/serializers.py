from .models import Order, Requisition
from rest_framework import serializers


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class RequisitionSerializer(serializers.ModelSerializer):
    provider = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name',
    )

    product = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name',
    )

    class Meta:
        model = Requisition
        fields = '__all__'


class ListOrderSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
    )
    requisitions = RequisitionSerializer(
        many=True,
        read_only=True,
        source='requisition_set'
    )

    class Meta:
        model = Order
        fields = '__all__'
