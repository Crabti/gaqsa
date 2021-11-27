from offers.models import Offer
from offers.serializers.offer import OfferSerializer
from rest_framework import serializers

from products.models import (
    Product, ChangePriceRequest, ProductProvider
)
from products.serializers.laboratory import LaboratorySerializer
from providers.models import Provider


class CreateProductProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductProvider
        exclude = ('id', 'product')


class AddProviderToProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductProvider
        exclude = ('id', )


class UpdateProductProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductProvider
        fields = ('iva', 'price', 'laboratory')


class ProductProviderSerializer(serializers.ModelSerializer):
    provider = serializers.SlugRelatedField(
        read_only=True,
        slug_field="name",
    )

    laboratory = LaboratorySerializer()

    offer = serializers.SerializerMethodField()

    @staticmethod
    def get_offer(instance):
        latest_offer = Offer.objects.filter(
            product_provider=instance.pk
        ).last()

        if latest_offer and latest_offer.active:
            return OfferSerializer(latest_offer).data
        return None

    class Meta:
        model = ProductProvider
        fields = '__all__'


class CreateProductSerializer(serializers.ModelSerializer):
    provider = CreateProductProviderSerializer(write_only=True)

    class Meta:
        model = Product
        fields = (
            "name",
            "presentation",
            "category",
            "ieps",
            "more_info",
            "animal_groups",
            "active_substance",
            "provider",
            "status"
        )

    def create(self, validated_data):
        provider_data = validated_data.pop('provider')
        animal_groups = validated_data.pop('animal_groups')
        product = Product.objects.create(**validated_data)
        if animal_groups:
            for group in animal_groups:
                product.animal_groups.add(group)

        ProductProvider.objects.create(product=product, **provider_data)
        return product


class UpdateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "pk",
            "category",
            "key",
            "name",
            "presentation",
            "ieps",
            "more_info",
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
            "ieps",
            "presentation",
            "category",
            "more_info",
            "created_at",
            "updated_at",
            "animal_groups",
            "active_substance",
        )


class ListProviderProductsSerializer(serializers.ModelSerializer):
    providers = serializers.SerializerMethodField()

    category = serializers.SlugRelatedField(
        read_only=True,
        slug_field="name",
    )

    animal_groups = serializers.SlugRelatedField(
        read_only=True,
        slug_field="name",
        many=True
    )

    offer = serializers.SerializerMethodField()

    def get_providers(self, instance):
        provider = Provider.objects.get(user=self.context['request'].user)
        user_provider = ProductProvider.objects.filter(
            provider=provider,
            product=instance
        )
        return ProductProviderSerializer(
            user_provider,
            many=True,
        ).data

    @staticmethod
    def get_offer(instance):
        latest_offer = Offer.objects.filter(
            product_provider=instance.pk
        ).last()

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
            "ieps",
            "more_info",
            "created_at",
            "updated_at",
            "animal_groups",
            "active_substance",
            "offer",
            "providers"
        )


class ListProductSerializer(serializers.ModelSerializer):
    providers = ProductProviderSerializer(many=True)

    category = serializers.SlugRelatedField(
        read_only=True,
        slug_field="name",
    )

    animal_groups = serializers.SlugRelatedField(
        read_only=True,
        slug_field="name",
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
            "ieps",
            "more_info",
            "providers",
            "created_at",
            "updated_at",
            "animal_groups",
            "active_substance",
            "status"
        )


class CreateChangePriceRequest(serializers.ModelSerializer):
    class Meta:
        model = ChangePriceRequest
        fields = "__all__"


class UpdateProductPrice(serializers.ModelSerializer):
    class Meta:
        model = ProductProvider
        fields = (
            "price",
        )


class AcceptProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "status",
            "name",
        )


class RejectProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "status",
            "reject_reason",
        )
