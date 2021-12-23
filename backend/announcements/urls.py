from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from .views import CreateAnnouncement, AnnouncementDetail

urlpatterns = [
    path("", CreateAnnouncement.as_view(), name="announcements"),
    path("<int:pk>", AnnouncementDetail.as_view(), name="announcement_detail"),
] + static(settings.MEDIA_ROOT, document_root=settings.MEDIA_ROOT)
