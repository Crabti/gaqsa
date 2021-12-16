from invoices.models import Invoice
from invoices.serializers.invoice import NewInvoiceSerialier
from rest_framework import generics


class CreateInvoice(generics.CreateAPIView):
    serializer_class = NewInvoiceSerialier
    queryset = Invoice.objects.all()
