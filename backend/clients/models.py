from django.db import models

from users.models import Business


class Client(Business):
    pass


class Ranch(models.Model):
    key = models.CharField(max_length=20, verbose_name='Clave Interna')
    name = models.CharField(max_length=100, verbose_name='Rancho')
    client = models.ForeignKey(Client, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.key} - {self.name} - {self.client}"
