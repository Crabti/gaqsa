from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from invoices.mails import send_mail_on_notify_invoice
from invoices.models import Invoice
from backend.utils.groups import is_client, is_invoice_manager, is_provider
from invoices.serializers.invoice import (
    NewInvoiceSerialier, ListInvoiceSerializer,
    UpdateStatusSerializer,
)
from rest_framework import generics, status
from backend.utils.permissions import (
    InvoiceStatusUpdate, IsAdmin, IsInvoiceCheckDay, IsProvider,
)
from providers.models import Provider


class CreateInvoice(generics.CreateAPIView):
    permission_classes = (IsProvider | IsAdmin, )  # type: ignore
    serializer_class = NewInvoiceSerialier
    queryset = Invoice.objects.all()


class ListInvoice(generics.ListAPIView):
    serializer_class = ListInvoiceSerializer

    def get_queryset(self):
        if is_provider(self.request.user):
            try:
                provider = Provider.objects.get(
                    user=self.request.user,
                )
            except Provider.DoesNotExist:
                raise ValidationError(
                    detail='Provider not found.'
                )
            return Invoice.objects.filter(
                order__provider=provider,
            )
        if is_client(self.request.user):
            return Invoice.objects.filter(
                order__user=self.request.user,
                is_client_responsible=True,
            )
        if is_invoice_manager(self.request.user):
            return Invoice.objects.filter(
                is_client_responsible=False,
            )
        return Invoice.objects.all()


class UpdateInvoiceStatus(generics.UpdateAPIView):
    permission_classes = [
        IsAuthenticated
        & InvoiceStatusUpdate   # type: ignore
        & IsInvoiceCheckDay
    ]
    serializer_class = UpdateStatusSerializer
    queryset = Invoice.objects.all()
    lookup_field = 'pk'


class NotifyInvoices(APIView):
    permission_classes = [IsProvider | IsAdmin]    # type: ignore

    def post(self, request):
        invoices = request.data["invoices"]
        if invoices:
            updated_invoices = []
            for pk in invoices:
                try:
                    invoice = Invoice.objects.get(pk=pk)
                    updated = invoice
                    updated.notified = True
                    updated_invoices.append(
                        updated
                    )
                except Invoice.DoesNotExist:
                    pass

            Invoice.objects.bulk_update(
                updated_invoices,
                ['notified'],
            )
            send_mail_on_notify_invoice(
                updated_invoices,
                request.user.pk,
            )
            return Response(
                {
                    "invoices": ListInvoiceSerializer(
                        list(updated_invoices),
                        many=True
                    ).data
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "detail": "No invoices provided.",
                    "code": "NOT_PROVIDED",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
