from django.db import models
from users.models import User


class Purchase_Order(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    key = models.CharField(max_length=8, verbose_name="Clave", unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
