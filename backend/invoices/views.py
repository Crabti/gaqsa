from invoices.models import Invoice
from invoices.serializers.invoice import (
    NewInvoiceSerialier, ListInvoiceSerializer,
    UpdateStatusSerializer,
)
from rest_framework import generics
from backend.utils.permissions import (
    IsAdmin, IsInvoiceCheckDay, IsProvider,
    IsInvoiceManager
)


class CreateInvoice(generics.CreateAPIView):
    permission_classes = (IsProvider | IsAdmin, )  # type: ignore
    serializer_class = NewInvoiceSerialier
    queryset = Invoice.objects.all()


class ListInvoice(generics.ListAPIView):
    permission_classes = [IsAdmin | IsInvoiceManager]   # type: ignore
    serializer_class = ListInvoiceSerializer
    queryset = Invoice.objects.all()


class UpdateInvoiceStatus(generics.UpdateAPIView):
    permission_classes = [
        (IsAdmin | IsInvoiceManager)   # type: ignore
        & IsInvoiceCheckDay
    ]
    serializer_class = UpdateStatusSerializer
    queryset = Invoice.objects.all()
    lookup_field = 'pk'
