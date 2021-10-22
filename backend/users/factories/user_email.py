from factory import django, LazyAttribute

from backend.faker import sfaker
from users.models import UserEmail


class UserEmailFactory(django.DjangoModelFactory):
    class Meta:
        model = UserEmail
    email = LazyAttribute(lambda _: sfaker.unique.email())
    category = LazyAttribute(
        lambda _:
        sfaker.user_email_category()
    )
