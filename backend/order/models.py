from django.db import models
from users.models import User
from products.models import Product
from providers.models import Provider


class Requisition(models.Model):
    DELIVERED = 'Entregado'
    PENDING = 'Pendiente'
    REJECTED = 'Rechazado'
    INCOMPLETE = 'Incompleto'
    CANCELLED = 'Cancelado',
    STATUSES = [
        (DELIVERED, DELIVERED),
        (PENDING, PENDING),
        (REJECTED, REJECTED),
        (INCOMPLETE, INCOMPLETE),
        (CANCELLED, CANCELLED),
    ]
    order = models.ForeignKey('order.Order', on_delete=models.CASCADE)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_requested = models.PositiveIntegerField()
    quantity_accepted = models.PositiveIntegerField(default=0)
    price = models.FloatField()

    @property
    def status(self):
        if self.quantity_accepted < self.quantity_requested:
            return Requisition.PENDING
        else:
            return Requisition.DELIVERED


class Order(models.Model):
    ACCEPTED = 'Entregado'
    CANCELLED = 'Cancelado'
    INCOMPLETE = 'Incompleto'

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cancelled = models.BooleanField(default=False)

    @property
    def requisitions(self):
        return self.requisition_set.all()

    @property
    def status(self):
        if self.cancelled:
            return Order.CANCELLED

        received = self.requisition_set.all()
        received_count = 0
        for requisition in received:
            if requisition.status == Requisition.DELIVERED:
                received_count = received_count + 1

        if received_count >= len(self.requisitions):
            return Order.ACCEPTED
        else:
            return Order.INCOMPLETE

    def __str__(self):
        return f"{self.created_at} - {self.user} \
         - {self.updated_at} - {self.status}"
