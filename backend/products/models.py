from django.db import models
from providers.models import Provider
from random import sample
from string import ascii_uppercase

KEY_LEN = 8


def generate_unique_key():
    while True:
        key = ''.join(sample(ascii_uppercase, KEY_LEN))
        if not Product.objects.filter(key=key).exists():
            return key


class Product(models.Model):
    GENERIC = 'Sí'
    NOT_GENERIC = 'No'
    IS_GENERIC_CHOICES = [
        (GENERIC, GENERIC),
        (NOT_GENERIC, NOT_GENERIC),
    ]

    ACCEPTED = 'Aceptado'
    PENDING = 'Pendiente'
    REJECTED = 'Rechazado'
    INACTIVE = 'Inactivo'
    STATUSES = [
        (ACCEPTED, ACCEPTED),
        (PENDING, PENDING),
        (REJECTED, REJECTED),
        (INACTIVE, INACTIVE)
    ]

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    key = models.CharField(
            max_length=KEY_LEN, verbose_name="Clave",
            unique=True, default=generate_unique_key)
    name = models.CharField(max_length=50, verbose_name="Nombre del Producto")
    dose = models.CharField(max_length=30, verbose_name="Dosis", blank=True)
    presentation = models.CharField(
        max_length=20, verbose_name="Presenta", blank=True,
    )
    price = models.DecimalField(
        decimal_places=2, max_digits=10, verbose_name="Precio", default=0.0,
    )
    iva = models.DecimalField(
        decimal_places=2, max_digits=5, verbose_name="IVA", default=0.0,
    )
    ieps = models.DecimalField(
        decimal_places=2, max_digits=5, verbose_name="IEPS", default=0.0,
    )
    more_info = models.CharField(
        max_length=200, blank=True, verbose_name="Información",
    )
    is_generic = models.CharField(
        max_length=2,
        choices=IS_GENERIC_CHOICES,
        default=NOT_GENERIC,
        verbose_name="Genérico",
    )
    status = models.CharField(
        max_length=20,
        choices=STATUSES,
        default=PENDING,
        verbose_name="Estado de producto",
    )
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)
    reject_reason = models.CharField(
        max_length=500,
        default="N/A"
    )

    def __str__(self):
        return f"{self.key} - {self.provider.name} \
         - {self.name} - {self.presentation} - {self.status}"
