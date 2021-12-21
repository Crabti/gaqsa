from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from .views import CreateAnnouncement

urlpatterns = [
    path("", CreateAnnouncement.as_view(), name="announcements"),
] + static(settings.MEDIA_ROOT, document_root=settings.MEDIA_ROOT)
