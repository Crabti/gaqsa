from rest_framework import serializers

from offers.models import Offer


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__'


class CreateOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = (
            "product_provider",
            "discount_percentage",
            "ending_at",
        )
