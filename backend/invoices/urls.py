from django.urls import path
from . import views

urlpatterns = [
    path("create", views.CreateInvoice.as_view(), name="create_invoice"),
    path("", views.ListInvoice.as_view(), name="list_invoice"),
    path(
        "<int:pk>/status",
        views.UpdateInvoiceStatus.as_view(),
        name="update_invoice_status"
    ),
    path(
        "notify",
        views.NotifyInvoices.as_view(),
        name="notify_invoice",
    ),
]
