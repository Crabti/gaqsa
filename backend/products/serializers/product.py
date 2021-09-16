from rest_framework import serializers

from products.models import Product


class CreateProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "key",
            "name",
            "dose",
            "presentation",
            "price",
            "iva",
            "more_info",
            "is_generic",
        )
