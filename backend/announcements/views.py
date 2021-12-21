import os.path
from typing import Tuple

from announcements.models import Announcement
from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from uuid import uuid4

from announcements.serializers.announcement import (
    CreateAnnouncementSerializer, ListAnnouncementsSerializer,
)
from backend.settings import MEDIA_ROOT, DOMAIN_URL
from backend.utils.groups import is_provider, is_client, is_admin


class CreateAnnouncement(APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def post(self, request: Request) -> Response:
        if not is_admin(request.user):
            return Response(
                {"status": "forbidden"}, status=status.HTTP_403_FORBIDDEN,
            )

        file = request.FILES["file"]

        file_extension = file.name.split('.')[-1]

        if (
            file_extension != "pdf"
            and file_extension != "png"
            and file_extension != "jpg"
            and file_extension != "jpeg"
        ):
            return Response(
                {"status": "bad_request"}, status=status.HTTP_400_BAD_REQUEST,
            )

        file_path, file_url = self._build_file_path(file_extension)
        print(file_url)
        default_storage.save(file_path, file)
        serializer = CreateAnnouncementSerializer(
            data={
                "title": request.data["title"],
                "content": request.data["content"],
                "addressee": request.data["addressee"],
                "created_by": request.user.pk,
                "file_url": file_url
            },
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()
        return Response({"status": "ok"}, status=status.HTTP_201_CREATED)

    def get(self, request: Request) -> Response:
        # anns = announcements
        if is_provider(request.user):
            anns = Announcement.objects.filter(
                addressee=Announcement.PROVIDERS,
            )
        elif is_client(request.user):
            anns = Announcement.objects.filter(addressee=Announcement.CLIENTS)
        else:
            anns = Announcement.objects.all()

        serializer = ListAnnouncementsSerializer(anns, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def _build_file_path(extension: str) -> Tuple[str, str]:
        """Builds the complete file path to be saved with an unique name.

        :returns: A tuple with the file path and the file URL.
        """
        file_id = str(uuid4())
        # DOMAIN/announcements/MEDIA/UUID.pdf|png|jpg|jpeg
        url = f"{DOMAIN_URL}/announcements{MEDIA_ROOT}{file_id}.{extension}"
        return os.path.join(MEDIA_ROOT, f"{file_id}.{extension}"), url
