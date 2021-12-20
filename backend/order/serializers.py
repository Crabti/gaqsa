from .models import Order, Requisition
from rest_framework import serializers
from products.serializers.product import ProductSerializer


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


class NestedRequisitionSerializer(serializers.ModelSerializer):
    provider = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name',
    )
    status = serializers.ReadOnlyField()

    product = ProductSerializer()

    class Meta:
        model = Requisition
        fields = '__all__'


class CreateRequisitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requisition
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class ListOrderSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
    )
    provider = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name'
    )
    requisitions = RequisitionSerializer(
        many=True,
        read_only=True,
        source='requisition_set'
    )

    status = serializers.ReadOnlyField()
    total = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = (
            'id',
            'requisitions',
            'status',
            'user',
            'created_at',
            'provider',
            'total'
        )


class ListRequisitionSerializer(serializers.ModelSerializer):
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


class RetrieveOrderSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
    )
    provider = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name'
    )
    requisitions = NestedRequisitionSerializer(many=True)

    status = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = (
            'id',
            'requisitions',
            'status',
            'user',
            'created_at',
            'provider'
        )


class UpdateOrderQuantitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Requisition
        fields = (
            'quantity_accepted',
            'sent'
        )


class CancelOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            "cancelled",
        )
