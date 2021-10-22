from datetime import datetime
from factory import django, LazyAttribute

from users.models import Business
from backend.faker import sfaker
import random


class BusinessFactory(django.DjangoModelFactory):
    class Meta:
        model = Business

    created_at = LazyAttribute(lambda _: datetime.now())
    updated_at = LazyAttribute(lambda _: datetime.now())
    name = LazyAttribute(lambda _: sfaker.unique.company())
    rfc = LazyAttribute(lambda _: sfaker.unique.rfc())
    internal_key = LazyAttribute(
        lambda _: f"{sfaker.unique.bothify(text='??-##')}")
    dimension = LazyAttribute(lambda _: f"{random.randint(0,1000)}")
