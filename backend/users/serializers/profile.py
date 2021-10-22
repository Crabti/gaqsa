from users.models import Profile
from rest_framework import serializers


class CreateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            "telephone",
        )
