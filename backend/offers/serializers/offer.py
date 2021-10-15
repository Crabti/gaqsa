from rest_framework import serializers

from offers.models import Offer


class CreateOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = (
            "product",
            "discount_percentage",
            "ending_at",
        )
