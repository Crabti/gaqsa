from factory import django, LazyAttribute

from backend.faker import sfaker
from users.models import Profile


class ProfileFactory(django.DjangoModelFactory):
    class Meta:
        model = Profile

    telephone = LazyAttribute(
        lambda _: f"{sfaker.bothify(text='???-#######')}"
    )
