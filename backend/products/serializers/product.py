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
            "animal_groups",
            "active_substance",
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
            "reject_reason",
            "animal_groups",
            "active_substance",
        )


class ProductSerializer(serializers.ModelSerializer):
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
            "updated_at",
            "animal_groups",
            "active_substance"
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
    animal_groups = serializers.SlugRelatedField(
        read_only=True,
        slug_field='name',
        many=True
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
            "updated_at",
            "animal_groups",
            "active_substance",
        )
