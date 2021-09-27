from django.db import models
from users.models import User
from products.models import Product
from providers.models import Provider


class Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.created_at} - {self.user} \
         - {self.updated_at} "


class Requisition(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_requested = models.PositiveIntegerField()
    quantity_accepted = models.PositiveIntegerField(default=0)
    price = models.FloatField()
