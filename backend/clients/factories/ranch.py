from clients.models import Ranch
from factory import django, LazyAttribute
from backend.faker import sfaker


class RanchFactory(django.DjangoModelFactory):
    class Meta:
        model = Ranch

    key = LazyAttribute(lambda _: f"{sfaker.unique.bothify(text='??-##')}")
    name = LazyAttribute(lambda _: f"{sfaker.ranch_name()}")
