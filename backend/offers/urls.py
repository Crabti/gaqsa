from django.urls import path
from . import views

urlpatterns = [
    path("create", views.CreateOfferView.as_view(), name="create_offer"),
]
