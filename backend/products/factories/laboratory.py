from datetime import datetime
from factory import django, LazyAttribute

import products.models
from backend.faker import sfaker


class LaboratoryFactory(django.DjangoModelFactory):
    class Meta:
        model = products.models.Laboratory

    created_at = LazyAttribute(lambda _: datetime.now())
    updated_at = LazyAttribute(lambda _: datetime.now())
    name = LazyAttribute(lambda _: sfaker.lab_name())
