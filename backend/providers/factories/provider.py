from users.factories.business import BusinessFactory
from factory import LazyAttribute

from providers.models import Provider
from backend.faker import sfaker


class ProviderFactory(BusinessFactory):
    class Meta:
        model = Provider

    nav_key = LazyAttribute(lambda _: f"{sfaker.unique.bothify(text='??-##')}")
