from factory import django, LazyAttribute

import offers.models
import random
from datetime import datetime
from datetime import timedelta


class OfferFactory(django.DjangoModelFactory):
    class Meta:
        model = offers.models.Offer

    created_at = LazyAttribute(lambda _: datetime.now())
    updated_at = LazyAttribute(lambda _: datetime.now())
    discount_percentage = LazyAttribute(lambda _: random.random())
    # By default end in one week
    ending_at = LazyAttribute(
        lambda _: datetime.now() + timedelta(days=7)
    )
