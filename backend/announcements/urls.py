from django.urls import path

from .views import CreateAnnouncement

urlpatterns = [
    path("", CreateAnnouncement.as_view(), name="create_announcement"),
]
