import json
from rest_framework import serializers
from auditlog.models import LogEntry


class AuditLogSerializer(serializers.ModelSerializer):
    actor = serializers.SlugRelatedField(
        read_only=True,
        slug_field="username",
    )

    class Meta:
        model = LogEntry
        fields = (
            "pk",
            "actor",
            "object_repr",
            "action",
            "timestamp",
            "changes",
            "remote_addr"
        )

    def to_representation(self, instance):
        data = super(AuditLogSerializer, self).to_representation(instance)
        data["changes"] = json.loads(data["changes"])
        return data
