from random import sample
from string import ascii_uppercase
from django.db import models

from users.models import Business

TOKEN_LEN = 8


def generate_unique_token():
    while True:
        token = ''.join(sample(ascii_uppercase, TOKEN_LEN))
        if not Provider.objects.filter(token=token).exists():
            return token


class Provider(Business):
    email = models.EmailField(verbose_name='Correo Electrónico')
    token = models.CharField(
            null=True,
            max_length=TOKEN_LEN, unique=True,
            verbose_name='Token Cambio de Precio'
    )
    token_used = models.BooleanField(
        default=False,
        verbose_name='Token Cambio de Precio Utilizado'
    )
    # TODO: Remove default after applying migration to production
    nav_key = models.CharField(
        verbose_name="Clave Nav",
        max_length=100,
        default=""
    )
