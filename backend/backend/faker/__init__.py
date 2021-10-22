from faker import Faker

from backend.faker.product_provider import ProductProvider
from backend.faker.category_provider import CategoryProvider
from backend.faker.laboratory_provider import LaboratoryProvider
from backend.faker.animal_group_provider import AnimalGroupProvider
from backend.faker.user_email_provider import UserEmailProvider
from backend.faker.ranch_provider import RanchProvider

sfaker = Faker(['es_MX'])
sfaker.add_provider(ProductProvider)
sfaker.add_provider(LaboratoryProvider)
sfaker.add_provider(CategoryProvider)
sfaker.add_provider(AnimalGroupProvider)
sfaker.add_provider(UserEmailProvider)
sfaker.add_provider(RanchProvider)

__all__ = ("sfaker",)
