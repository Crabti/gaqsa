from users.models import UserEmail
from rest_framework import serializers


class CreateUserEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEmail
        fields = (
            "email",
            "category"
        )


class UserEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserEmail
        fields = "__all__"
