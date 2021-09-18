from faker import Faker

from backend.faker.product_provider import ProductProvider

sfaker = Faker(['es_MX'])
sfaker.add_provider(ProductProvider)

__all__ = ("sfaker",)
