from invoices.mails import send_mail_on_invoice_status_update
from invoices.models import Invoice
from rest_framework import serializers


class NewInvoiceSerialier(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Invoice
        fields = (
            "id",
            "delivery_date",
            "order",
            "xml_file",
            "invoice_file",
            "extra_file",
        )


class ListInvoiceSerializer(serializers.ModelSerializer):
    can_update_status_today = serializers.ReadOnlyField()

    class Meta:
        model = Invoice
        fields = "__all__"
        extra_fields = [
            'can_update_status_today',
        ]


class UpdateStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = (
            "status",
            "reject_reason",
        )

    def update(self, instance, validated_data):
        invoice = super(
            UpdateStatusSerializer, self
        ).update(instance, validated_data)
        send_mail_on_invoice_status_update(
            invoice
        )
        return invoice
