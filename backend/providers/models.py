from random import sample
from string import ascii_uppercase
from django.db import models
from django.core.validators import MinLengthValidator, RegexValidator
from django.contrib.auth.models import User

TOKEN_LEN = 8


def generate_unique_token():
    while True:
        token = ''.join(sample(ascii_uppercase, TOKEN_LEN))
        if not Provider.objects.filter(token=token).exists():
            return token


class Provider(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    # Only alphanumeric values with min 12 characters and max 13 characters
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
    address = models.CharField(
        max_length=150,
    )
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

    def __str__(self):
        return f'{self.name} - {self.rfc}'
