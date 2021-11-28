from django.db import models
from users.models import User
from products.models import Product
from providers.models import Provider
from django.db.models import Sum


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
    def requisitions(self):
        return self.requisition_set.all()

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

    def __str__(self):
        return f"{self.created_at} - {self.user} \
         - {self.updated_at} - {self.status}"
