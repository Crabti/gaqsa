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

    def create(self, validated_data):
        xml_file = validated_data.get("xml_file")
        print(xml_file)
        invoice = Invoice.objects.create(
            invoice_folio=".",
            invoice_date="02-02-02",
            amount=3000,
            client="RFOOSPF",
            **validated_data,
        )
        return invoice
