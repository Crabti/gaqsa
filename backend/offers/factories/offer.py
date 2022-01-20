from factory import django, LazyAttribute, SubFactory

import offers.models
import random
from datetime import date
from datetime import timedelta

from users.factories.user import UserFactory


class OfferFactory(django.DjangoModelFactory):
    class Meta:
        model = offers.models.Offer

    created_at = LazyAttribute(lambda _: date.today())
    updated_at = LazyAttribute(lambda _: date.today())
    discount_percentage = LazyAttribute(
        lambda _: round(random.uniform(0.01, 0.99), 2)
    )
    # By default end in one week
    ending_at = LazyAttribute(
        lambda _: date.today() + timedelta(days=7)
    )
    user = SubFactory(UserFactory)
