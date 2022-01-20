from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from datetime import date
from products.models import ProductProvider
from users.models import User
from auditlog.registry import auditlog


class Offer(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    discount_percentage = models.DecimalField(
        decimal_places=15,
        max_digits=16,
        validators=[
            MinValueValidator(0.01),
            MaxValueValidator(1),
        ]
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product_provider = models.ForeignKey(
        ProductProvider,
        on_delete=models.CASCADE,
    )
    ending_at = models.DateField()
    cancelled = models.BooleanField(default=False)

    @property
    def active(self):
        return not self.cancelled and \
                date.today() < self.ending_at

    def __str__(self):
        return f"{self.product_provider} \
                 - ({self.created_at} - {self.ending_at}) \
                 - {self.discount_percentage * 100} %"


auditlog.register(Offer)
