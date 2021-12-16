from django.db import models
from order.models import Order

class Invoice(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    invoice_folio = models.CharField(verbose_name="Folio", editable=False)
    invoice_date = models.DateTimeField(verbose_name="Fecha Factura"), editable=False
    amount = models.DecimalField(verbose_name="Importe", editable=False)
    client = models.CharField(verbose_name="Socio", editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    delivery_date = models.DateTimeField(verbose_name="Fecha Entrega")
    xml_file = models.FileField(upload_to ='invoices/', unique=True)
    invoice_file = models.FileField(upload_to ='invoices/', unique=True)
    extra_file = models.FileField(upload_to ='invoices/', unique=True)
    ACCEPTED = "Aceptado"
    PENDING = "Pendiente"
    REJECTED = "Rechazada"
    STATUSES = [
        (ACCEPTED, ACCEPTED),
        (PENDING, PENDING),
        (REJECTED, REJECTED)
    ]
    status = models.CharField(choices=STATUSES, default=PENDING, verbose_name="Estado de Factura")

