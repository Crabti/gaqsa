import uuid
import os

from django.db import models
from django.conf import settings
from backend.utils.permissions import available_today
from order.models import Order
from django.core.validators import FileExtensionValidator
from backend.utils.files import parse_invoice_xml
from rest_framework import serializers
from auditlog.registry import auditlog


def get_file_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return os.path.join(settings.INVOICE_FILE_ROOT, filename)


class Invoice(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    invoice_folio = models.CharField(
        verbose_name="Folio",
        editable=False,
        max_length=30
    )
    invoice_date = models.DateTimeField(
        verbose_name="Fecha Factura", editable=False
    )
    amount = models.FloatField(verbose_name="Importe", editable=False)
    client = models.CharField(
        verbose_name="Socio",
        editable=False,
        max_length=255
    )
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    delivery_date = models.DateField(verbose_name="Fecha Entrega")
    xml_file = models.FileField(
        upload_to=get_file_path,
        validators=[FileExtensionValidator(allowed_extensions=['xml'])]
    )
    invoice_file = models.FileField(
        upload_to=get_file_path,
        validators=[
            FileExtensionValidator(
                allowed_extensions=[
                    'pdf',
                    'png',
                    'jpg'
                ]
            )
        ]
    )
    extra_file = models.FileField(
        upload_to=get_file_path,
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(
                allowed_extensions=[
                    'pdf',
                    'png',
                    'jpg'
                ]
            )
        ]
    )
    ACCEPTED = "Aceptado"
    PENDING = "Pendiente"
    REJECTED = "Rechazada"
    STATUSES = [
        (ACCEPTED, ACCEPTED),
        (PENDING, PENDING),
        (REJECTED, REJECTED)
    ]
    status = models.CharField(
        choices=STATUSES,
        default=PENDING,
        verbose_name="Estado de Factura",
        max_length=30
    )
    reject_reason = models.CharField(
        max_length=500,
        default="N/A"
    )
    notified = models.BooleanField(
        default=False,
    )

    @property
    def can_update_status(self):
        return available_today(
            settings.INVOICE_STATUS_UPDATE_WEEKDAYS
        )

    def __str__(self) -> str:
        return f"{self.client} - {self.invoice_folio} - {self.status}"

    def save(self, *args, **kwargs):
        try:
            parsed_attributes = parse_invoice_xml(self.xml_file)
            for attr, value in parsed_attributes.items():
                setattr(self, attr, value)
            super(Invoice, self).save(*args, **kwargs)
        except Exception as e:
            raise serializers.ValidationError(e)


auditlog.register(Invoice)
