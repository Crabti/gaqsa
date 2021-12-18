from invoices.models import Invoice
from invoices.serializers.invoice import NewInvoiceSerialier
from rest_framework import generics
from backend.utils.permissions import IsAdmin, IsProvider


class CreateInvoice(generics.CreateAPIView):
    permission_classes = (IsProvider | IsAdmin, )  # type: ignore
    serializer_class = NewInvoiceSerialier
    queryset = Invoice.objects.all()
