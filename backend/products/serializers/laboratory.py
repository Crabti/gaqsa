from rest_framework import serializers

from products.models import Laboratory


class ListLaboratorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Laboratory
        fields = (
            "id",
            "name",
        )


class LaboratorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Laboratory
        fields = (
            "id",
            "name",
        )
