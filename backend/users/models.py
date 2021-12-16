from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, RegexValidator
from auditlog.registry import auditlog


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    telephone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class UserEmail(models.Model):
    ORDERS = "Pedidos"
    INVOICE = "Facturas"
    PRICE_CHANGE = "Cambio de precios"
    PAYMENTS = "Saldos"
    MAIL_CATEGORY = [
        (ORDERS, ORDERS),
        (INVOICE, INVOICE),
        (PRICE_CHANGE, PRICE_CHANGE),
        (PAYMENTS, PAYMENTS),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField()
    category = models.CharField(
        max_length=50,
        choices=MAIL_CATEGORY,
        verbose_name="Categoría de correo electrónico",
    )

    def __str__(self):
        return f"{self.user.username} - {self.email} - {self.category}"


class Business(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=100)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rfc = models.CharField(
        max_length=13,
        unique=True,
        validators=[
            MinLengthValidator(12),
            RegexValidator(
                r'^[0-9a-zA-Z]*$',
            )
        ],
    )
    dimension = models.IntegerField(default=1)
    internal_key = models.CharField(default="", max_length=100)
    invoice_telephone = models.CharField(default="", max_length=20)

    class Meta:
        abstract = True

    def __str__(self):
        return f'{self.name} - {self.rfc}'


auditlog.register(User)
auditlog.register(Profile)
auditlog.register(UserEmail)
