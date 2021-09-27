from datetime import datetime
from factory import django, LazyAttribute

import order.models
from backend.faker import sfaker


class OrderFactory(django.DjangoModelFactory):
    class Meta:
        model = order.models.Order

    created_at = LazyAttribute(lambda _: datetime.now())
    updated_at = LazyAttribute(lambda _: datetime.now())


class RequisitionFactory(django.DjangoModelFactory):
    class Meta:
        model = order.models.Requisition

    quantity_requested = LazyAttribute(
        lambda _: sfaker.random_int(min=0, max=10)
    )
    quantity_accepted = LazyAttribute(
        lambda _: sfaker.random_int(min=0, max=10)
    )
    price = LazyAttribute(
        lambda _: sfaker.random_int(min=0, max=100000) / 100.0
    )
