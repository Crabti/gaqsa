from django.contrib.auth.models import User
from rest_framework import serializers
from auditlog.models import LogEntry


class AuditLogSerializer(serializers.ModelSerializer):
    actor = serializers.SlugRelatedField(
        read_only = True,
        slug_field="username",
        queryset=User.objects.all()
    )
    class Meta:
        model = LogEntry
        fields = "__all__"
