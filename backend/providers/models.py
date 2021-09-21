from django.db import models
from django.core.validators import MinLengthValidator, RegexValidator
from django.contrib.auth.models import User


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

    def __str__(self):
        return f'{self.name} - {self.rfc}'