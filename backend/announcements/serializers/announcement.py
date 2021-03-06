from announcements.models import Announcement
from rest_framework import serializers


class CreateAnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = (
            "title", "addressee", "content", "created_by", "file_url",
        )


class ListAnnouncementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = "__all__"
