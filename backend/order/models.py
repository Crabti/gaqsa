from django.apps import apps
from django.db import models
from users.models import User
from products.models import Product
from providers.models import Provider
from django.db.models import Sum
from auditlog.registry import auditlog


class Requisition(models.Model):
    DELIVERED = 'Entregado'
    PENDING = 'Pendiente'
    INCOMPLETE = 'Incompleto'
    STATUSES = [
        (DELIVERED, DELIVERED),
        (PENDING, PENDING),
        (INCOMPLETE, INCOMPLETE),
    ]
    order = models.ForeignKey("order.Order", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_requested = models.PositiveIntegerField()
    quantity_accepted = models.PositiveIntegerField(default=0)
    price = models.FloatField()
    sent = models.BooleanField(default=False)

    @property
    def status(self):
        if not self.sent:
            return Requisition.PENDING

        if self.quantity_accepted < self.quantity_requested:
            return Requisition.INCOMPLETE
        else:
            return Requisition.DELIVERED


class Order(models.Model):
    DELIVERED = 'Entregado'
    CANCELLED = 'Cancelado'
    INCOMPLETE = 'Incompleto'
    PENDING = 'Pendiente'

    INVOICE_PENDING = 'Pendiente'
    INVOICE_REJECTED = 'Rechazada'
    INVOICE_PARTIAL = 'Parcial'
    INVOICE_COMPLETE = 'Aceptada'

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cancelled = models.BooleanField(default=False)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)

    @property
    def total(self):
        queryset = self.requisition_set.all().aggregate(
            total_price=Sum('price')
        )
        return queryset['total_price']

    @property
    def invoice_total(self):
        Invoice = apps.get_model("invoices.Invoice")
        queryset = Invoice.objects.filter(
            order=self.pk,
            status=Invoice.ACCEPTED,
        ).aggregate(
            total_amount=Sum('amount')
        )
        return queryset['total_amount']

    @property
    def requisitions(self):
        return self.requisition_set.all()

    @property
    def invoices(self):
        return self.invoice_set.all()

    @property
    def status(self):
        if self.cancelled:
            return Order.CANCELLED

        received = self.requisition_set.all()
        sent_count = 0
        incomplete_found = False
        for requisition in received:
            if requisition.sent:
                sent_count = sent_count + 1
                if requisition.status == Requisition.INCOMPLETE:
                    incomplete_found = True

        if sent_count >= len(self.requisitions):
            if incomplete_found:
                return Order.INCOMPLETE
            else:
                return Order.DELIVERED
        else:
            return Order.PENDING

    # Returns None if no invoice has been submitted, or none of the
    # invoices have been accepted
    @property
    def invoice_status(self):
        Invoice = apps.get_model("invoices.Invoice")
        rejected_invoices = Invoice.objects.filter(
            order=self.pk,
            status=Invoice.REJECTED,
        )
        if rejected_invoices:
            return Order.INVOICE_REJECTED
        else: 
            invoices = Invoice.objects.filter(
                order=self.pk
            )
            if invoices:
                invoice_total = self.invoice_total
                if invoice_total is None:
                    return None
                if invoice_total >= self.total:
                    return Order.INVOICE_COMPLETE
                return Order.INVOICE_PARTIAL
            else:
                return Order.INVOICE_PENDING

    def __str__(self):
        return f"{self.created_at} - {self.user} \
         - {self.updated_at} - {self.status}"


auditlog.register(Order)
auditlog.register(Requisition)
