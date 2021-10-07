from django.db import models
from users.models import User
from products.models import Product
from providers.models import Provider


class Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    @property
    def requisitions(self):
        return self.requisition_set.all()

    def __str__(self):
        return f"{self.created_at} - {self.user} \
         - {self.updated_at} "


class Requisition(models.Model):
    ACCEPTED = 'Aceptado'
    PENDING = 'Pendiente'
    REJECTED = 'Rechazado'
    INCOMPLETE = 'Incompleto'
    STATUSES = [
        (ACCEPTED, ACCEPTED),
        (PENDING, PENDING),
        (REJECTED, REJECTED),
        (INCOMPLETE, INCOMPLETE)
    ]
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_requested = models.PositiveIntegerField()
    quantity_accepted = models.PositiveIntegerField(default=0)
    price = models.FloatField()
    status = models.CharField(
        max_length=20,
        choices=STATUSES,
        default=PENDING,
        verbose_name="Estado de producto",
    )
