from django.urls import path
from . import views

urlpatterns = [
    path("create", views.CreateInvoice.as_view(), name="create_invoice"),
    path("", views.ListInvoice.as_view(), name="list_invoice"),
]
