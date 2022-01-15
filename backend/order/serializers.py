from invoices.serializers.invoice import ListInvoiceSerializer
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
        fields = (
            'product',
            'quantity_requested',
            'price',
        )


class CreateOrderSerializer(serializers.ModelSerializer):
    requisitions = CreateRequisitionSerializer(many=True)

    class Meta:
        model = Order
        fields = (
            'user',
            'provider',
            'requisitions',
        )

    def create(self, validated_data):
        requisitions = validated_data.pop('requisitions')
        order = Order.objects.create(**validated_data)
        for requisition in requisitions:
            Requisition.objects.create(
                order=order,
                **requisition,
            )
        return order


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
    invoice_total = serializers.ReadOnlyField()
    invoice_status = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = (
            'id',
            'requisitions',
            'status',
            'user',
            'created_at',
            'provider',
            'total',
            'invoice_total',
            'invoice_status',
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
    invoices = ListInvoiceSerializer(
        many=True
    )
    total = serializers.ReadOnlyField()

    status = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = (
            'id',
            'requisitions',
            'status',
            'user',
            'created_at',
            'provider',
            'invoices',
            'total',
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


class RequisitionPreviewSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    quantity = serializers.IntegerField()
    total = serializers.FloatField()
    subtotal = serializers.FloatField()
    iva_total = serializers.FloatField()
    ieps_total = serializers.FloatField()
    price = serializers.FloatField()
    original_price = serializers.FloatField(allow_null=True)
    name = serializers.CharField()
    provider = serializers.CharField()
    presentation = serializers.CharField()
    lab = serializers.CharField()
    category = serializers.CharField()


class OrderPreviewSerializer(serializers.Serializer):
    total = serializers.FloatField()
    subtotal = serializers.FloatField()
    ieps_total = serializers.FloatField()
    iva_total = serializers.FloatField()
    products = RequisitionPreviewSerializer(many=True)
