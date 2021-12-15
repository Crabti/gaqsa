import os.path
from typing import Tuple

from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from uuid import uuid4

from announcements.serializers.announcement import CreateAnnouncementSerializer
from backend.settings import MEDIA_ROOT
from backend.utils.permissions import IsAdmin


class CreateAnnouncement(APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = (IsAdmin,)

    def post(self, request: Request) -> Response:
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

        file_path, file_id = self._build_file_path(file_extension)
        default_storage.save(file_path, file)
        serializer = CreateAnnouncementSerializer(
            data={
                "title": request.data["title"],
                "content": request.data["title"],
                "addressee": request.data["addressee"],
                "created_by": request.user.pk,
                "file_uuid": file_id
            },
        )

        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save()
        return Response({"status": "ok"}, status=status.HTTP_201_CREATED)

    @staticmethod
    def _build_file_path(extension: str) -> Tuple[str, str]:
        """Builds the complete file path to be saved with an unique name.

        :returns: A tuple with the file path and field id.
        """
        file_id = str(uuid4())
        return os.path.join(MEDIA_ROOT, f"{file_id}.{extension}"), file_id
