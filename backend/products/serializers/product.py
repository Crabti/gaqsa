from rest_framework import serializers

from products.models import Product


class CreateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "name",
            "presentation",
            "category",
            "laboratory",
            "price",
            "iva",
            "ieps",
            "more_info",
            "status",
            "provider",
        )


class UpdateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "pk",
            "category",
            "laboratory",
            "key",
            "name",
            "presentation",
            "price",
            "iva",
            "ieps",
            "more_info",
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
            "presentation",
            "category",
            "laboratory",
            "price",
            "iva",
            "ieps",
            "more_info",
            "status",
            "provider",
            "reject_reason",
            "created_at",
            "updated_at"
        )


class ListProductSerializer(serializers.ModelSerializer):
    provider = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name',
    )

    category = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name',
    )
    laboratory = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name',
    )

    class Meta:
        model = Product
        fields = (
            "id",
            "key",
            "name",
            "presentation",
            "category",
            "laboratory",
            "price",
            "iva",
            "ieps",
            "more_info",
            "status",
            "provider",
            "reject_reason",
            "created_at",
            "updated_at"
        )
