from datetime import datetime
from factory import django, LazyAttribute

import products.models
from backend.faker import sfaker


class ProductFactory(django.DjangoModelFactory):
    class Meta:
        model = products.models.Product

    created_at = LazyAttribute(lambda _: datetime.now())
    updated_at = LazyAttribute(lambda _: datetime.now())
    key = LazyAttribute(lambda _: f"{sfaker.bothify(text='??-##')}")
    name = LazyAttribute(lambda _: sfaker.product_name())
    dose = LazyAttribute(lambda _: sfaker.product_dose())
    presentation = LazyAttribute(lambda _: sfaker.product_presentation())
    price = LazyAttribute(
        lambda _: sfaker.random_int(min=0, max=100000) / 100.0
    )
    iva = LazyAttribute(lambda _: sfaker.random_int(min=0, max=16000) / 100.0)
    more_info = LazyAttribute(lambda _: sfaker.text(max_nb_chars=70))
    is_generic = LazyAttribute(
        lambda _: "Sí" if sfaker.random_int(min=0, max=1) else "No"
    )