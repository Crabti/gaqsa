import datetime

from django.contrib.auth.models import User
from django.db import models


class Announcement(models.Model):
    PROVIDERS = "providers"
    CLIENTS = "clients"
    ADDRESSEES = [
        (PROVIDERS, PROVIDERS),
        (CLIENTS, CLIENTS),
    ]
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=140, verbose_name="Título")
    addressee = models.CharField(
        max_length=15,
        choices=ADDRESSEES,
        default=CLIENTS,
        verbose_name="Destinatarios",
    )
    content = models.TextField(verbose_name="Contenido", blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    file_url = models.URLField(verbose_name="URL del archivo", default="")
    start_date = models.DateField(
        verbose_name="Fecha de inicio",
        default=datetime.date.today,
    )
    end_date = models.DateField(
        verbose_name="Fecha de fin",
        default=datetime.date.today,
    )

    def __str__(self) -> str:
        return f"{self.title} - {self.start_date} - {self.end_date}"
