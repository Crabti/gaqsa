from rest_framework import serializers

from products.models import Category


class ListCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
        )
