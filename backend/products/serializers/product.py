from offers.models import Offer
from offers.serializers.offer import OfferSerializer
from rest_framework import serializers

from products.models import Product, ChangePriceRequest


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
            "animal_groups",
            "active_substance",
        )


class CreateProductAsAdminSerializer(serializers.ModelSerializer):
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
            "animal_groups",
            "active_substance",
            "provider"
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
        slug_field="name",
    )

    category = serializers.SlugRelatedField(
        read_only=True,
        slug_field="name",
    )
    laboratory = serializers.SlugRelatedField(
        read_only=True,
        slug_field="name",
    )
    animal_groups = serializers.SlugRelatedField(
        read_only=True,
        slug_field="name",
        many=True
    )

    offer = serializers.SerializerMethodField()

    @staticmethod
    def get_offer(instance):
        latest_offer = Offer.objects.filter(product=instance.pk).last()

        if latest_offer and latest_offer.active:
            return OfferSerializer(latest_offer).data
        return None

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
            "offer"
        )


class CreateChangePriceRequest(serializers.ModelSerializer):
    class Meta:
        model = ChangePriceRequest
        fields = "__all__"
