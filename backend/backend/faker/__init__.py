from faker import Faker

from backend.faker.product_provider import ProductProvider

sfaker = Faker()
sfaker.add_provider(ProductProvider)

__all__ = ("sfaker",)
