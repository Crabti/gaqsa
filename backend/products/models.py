from django.db import models


class Product(models.Model):
    GENERIC = 'Sí'
    NOT_GENERIC = 'No'
    IS_GENERIC_CHOICES = [
        (GENERIC, GENERIC),
        (NOT_GENERIC, NOT_GENERIC),
    ]

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    key = models.CharField(max_length=8, verbose_name="Clave", unique=True)
    name = models.CharField(max_length=50, verbose_name="Nombre del Producto")
    dose = models.CharField(max_length=30, verbose_name="Dosis", blank=True)
    presentation = models.CharField(max_length=20, verbose_name="Presenta", blank=True)
    price = models.DecimalField(
        decimal_places=2, max_digits=10, verbose_name="Precio", default=0.0,
    )
    iva = models.DecimalField(
        decimal_places=2, max_digits=5, verbose_name="IVA", default=0.0,
    )
    more_info = models.CharField(max_length=200, blank=True, verbose_name="Información")
    is_generic = models.CharField(
        max_length=2, choices=IS_GENERIC_CHOICES, default=NOT_GENERIC,
    )

    def __str__(self):
        return f"{self.key} - {self.name} - {self.presentation}"
