from django.db import models
from users.models import User
from products.models import Product
from providers.models import Provider


class Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    key = models.CharField(max_length=8, verbose_name="OrdenCompra",
                           unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Requisition(models.Model):
    key = models.CharField(max_length=8, verbose_name="Requisicion",
                           unique=True)
    purchase_order = models.ForeignKey(Order,
                                       on_delete=models.CASCADE)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_requested = models.PositiveIntegerField()
    quantity_aceppted = models.PositiveIntegerField(default=0)
    price = models.FloatField()
