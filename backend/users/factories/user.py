from factory import django, LazyAttribute

from backend.faker import sfaker
from django.contrib.auth.models import User


class UserFactory(django.DjangoModelFactory):
    class Meta:
        model = User
    email = LazyAttribute(lambda _: sfaker.unique.email())
    username = LazyAttribute(
        lambda _:
        sfaker.simple_profile()['username'])
    password = LazyAttribute(lambda _: sfaker.password())
