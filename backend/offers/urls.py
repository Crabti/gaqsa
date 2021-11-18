from django.urls import path
from . import views

urlpatterns = [
    path("create", views.CreateOfferView.as_view(), name="create_offer"),
    path(
        "<int:pk>/cancel",
        views.CancelOfferView.as_view(),
        name="cancel_offer"
    ),
]
