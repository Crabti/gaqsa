from rest_framework import serializers
from providers.models import Provider
from users.models import UserEmail
from users.serializers.user_emails import UserEmailSerializer


class ProviderPkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = (
            "pk",
        )


class ListProviderSerializer(serializers.ModelSerializer):
    emails = serializers.SerializerMethodField()

    def get_emails(self, obj):
        emails = UserEmail.objects.filter(user=obj.user)
        if emails:
            return UserEmailSerializer(emails, many=True).data
        else:
            return None

    class Meta:
        model = Provider
        fields = (
            'id',
            'nav_key',
            'created_at',
            'updated_at',
            'name',
            'rfc',
            'dimension',
            'internal_key',
            'invoice_telephone',
            'emails',
        )


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = '__all__'


class CreateCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = (
            "token",
            "token_used",
            "token_apply_date"
        )


class CreateProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        exclude = ('id', 'user')
