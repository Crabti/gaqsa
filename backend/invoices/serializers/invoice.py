from invoices.models import Invoice
from rest_framework import serializers


class NewInvoiceSerialier(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = (
            "delivery_date",
            "order",
            "xml_file",
            "invoice_file",
            "extra_file",
        )

