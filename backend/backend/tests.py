from django.test.testcases import TestCase
from backend.utils.groups import is_admin, is_client, is_provider
from backend.utils.product_key import create_product_key
from backend.utils.tests import BaseTestCase
from products.factories.category import CategoryFactory
from products.factories.product import ProductFactory


class GroupsUtilsTest(BaseTestCase):
    def test_is_provider(self) -> None:
        self.assertTrue(is_provider(self.provider_user))

    def test_is_admin(self) -> None:
        self.assertTrue(is_admin(self.admin_user))

    def test_is_client(self) -> None:
        self.assertTrue(is_client(self.client_user))


class CreateProductKeyTest(TestCase):
    def test_generate_key(self) -> None:
        KEY_LEN = 7
        category = CategoryFactory.create()
        product = ProductFactory.build()
        self.assertEqual(
            len(create_product_key(category.pk, product.name)),
            KEY_LEN
        )
