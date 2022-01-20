from datetime import datetime
from factory import django, LazyAttribute, SubFactory

import products.models
from backend.faker import sfaker
from products.factories.category import CategoryFactory
from products.factories.laboratory import LaboratoryFactory
from providers.factories.provider import ProviderFactory


class ProductFactory(django.DjangoModelFactory):
    class Meta:
        model = products.models.Product

    created_at = LazyAttribute(lambda _: datetime.now())
    updated_at = LazyAttribute(lambda _: datetime.now())
    key = LazyAttribute(lambda _: f"{sfaker.unique.bothify(text='??-##')}")
    name = LazyAttribute(lambda _: sfaker.product_name())
    presentation = LazyAttribute(lambda _: sfaker.product_presentation())
    more_info = LazyAttribute(lambda _: sfaker.text(max_nb_chars=70))
    active_substance = LazyAttribute(
        lambda _: sfaker.product_active_substance())
    category = SubFactory(CategoryFactory)
    status = LazyAttribute(lambda _: products.models.Product.PENDING)


class ProductProviderFactory(django.DjangoModelFactory):
    class Meta:
        model = products.models.ProductProvider
    created_at = LazyAttribute(lambda _: datetime.now())
    updated_at = LazyAttribute(lambda _: datetime.now())
    price = LazyAttribute(
        lambda _: sfaker.random_int(min=0, max=100)
    )
    iva = LazyAttribute(lambda _: sfaker.random_int(min=0, max=100))
    laboratory = SubFactory(LaboratoryFactory)
    product = SubFactory(ProductFactory)
    provider = SubFactory(ProviderFactory)
