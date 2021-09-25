from rest_framework import serializers

from products.models import Product


class CreateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "name",
            "dose",
            "presentation",
            "price",
            "iva",
            "ieps",
            "more_info",
            "is_generic",
            "status",
            "provider",
            "key",
        )


class UpdateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "pk",
            "key",
            "name",
            "dose",
            "presentation",
            "price",
            "iva",
            "ieps",
            "more_info",
            "is_generic",
            "status",
            "provider",
            "reject_reason"
        )


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "key",
            "name",
            "dose",
            "presentation",
            "price",
            "iva",
            "ieps",
            "more_info",
            "is_generic",
            "status",
            "provider",
            "reject_reason"
        )
