from users.factories.business import BusinessFactory
from factory import LazyAttribute, SubFactory

from providers.models import Provider
from backend.faker import sfaker
from users.factories.user import UserFactory


class ProviderFactory(BusinessFactory):
    class Meta:
        model = Provider

    nav_key = LazyAttribute(lambda _: f"{sfaker.unique.bothify(text='??-##')}")
    user = SubFactory(UserFactory)
