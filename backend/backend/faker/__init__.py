from faker import Faker

from backend.faker.product_provider import ProductProvider
from backend.faker.category_provider import CategoryProvider
from backend.faker.laboratory_provider import LaboratoryProvider

sfaker = Faker(['es_MX'])
sfaker.add_provider(ProductProvider)
sfaker.add_provider(LaboratoryProvider)
sfaker.add_provider(CategoryProvider)

__all__ = ("sfaker",)
