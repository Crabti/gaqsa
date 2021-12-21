from invoices.models import Invoice
from invoices.serializers.invoice import (
    NewInvoiceSerialier, ListInvoiceSerializer
)
from rest_framework import generics
from backend.utils.permissions import IsAdmin, IsProvider


class CreateInvoice(generics.CreateAPIView):
    permission_classes = (IsProvider | IsAdmin, )  # type: ignore
    serializer_class = NewInvoiceSerialier
    queryset = Invoice.objects.all()


class ListInvoice(generics.ListAPIView):
    permission_classes = (IsAdmin, )
    serializer_class = ListInvoiceSerializer
    queryset = Invoice.objects.all()
