from datetime import datetime
from factory import django, LazyAttribute

from providers.models import Provider
from backend.faker import sfaker


class ProviderFactory(django.DjangoModelFactory):
    class Meta:
        model = Provider

    created_at = LazyAttribute(lambda _: datetime.now())
    updated_at = LazyAttribute(lambda _: datetime.now())
    name = LazyAttribute(lambda _: sfaker.unique.company())
    rfc = LazyAttribute(lambda _: sfaker.unique.rfc())
    address = LazyAttribute(lambda _: sfaker.address())
    email = LazyAttribute(lambda _: sfaker.email())
