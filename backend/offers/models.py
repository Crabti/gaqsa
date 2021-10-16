from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from products.models import Product
from django.utils.timezone import datetime
from users.models import User


class Offer(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    discount_percentage = models.DecimalField(
        decimal_places=2,
        max_digits=2,
        validators=[
            MinValueValidator(0.01),
            MaxValueValidator(1),
        ]
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    ending_at = models.DateTimeField()
    cancelled = models.BooleanField(default=False)

    @property
    def active(self):
        return not self.cancelled and \
                datetime.today().timestamp() < self.ending_at.timestamp()

    def __str__(self):
        return f"{self.product.name} - ({self.created_at} - {self.ending_at}) \
                 - {self.discount_percentage * 100} %"
