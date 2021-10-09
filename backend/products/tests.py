import json
from http import HTTPStatus

from django.urls import reverse
from django.core import mail

from products.factories.product import ProductFactory
from products.factories.laboratory import LaboratoryFactory
from products.factories.category import CategoryFactory
from products.factories.animal_groups import AnimalGroupFactory

from products.models import Product
from products.serializers.product import (
    CreateProductSerializer,
    ProductSerializer
)
from providers.factories.provider import ProviderFactory
from users.factories.user import UserFactory

from backend.utils.tests import BaseTestCase


class RegisterRequestToCreateProduct(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        ProviderFactory.create(user=self.provider_user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        animal_groups = AnimalGroupFactory.create_batch(5)
        product = ProductFactory.build(
            status=Product.PENDING,
            category=category, laboratory=laboratory,
        )
        self.valid_payload = CreateProductSerializer(
            product,
        ).data

        # Override serializer field to add m2m objects
        self.valid_payload["animal_groups"] = [
            group.id for group in animal_groups]

    def test_require_authentication(self) -> None:
        response = self.anonymous.post(
            reverse("create_product"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_request_to_create_product_with_valid_data_should_succeed(
        self,
    ) -> None:
        mail.outbox = []
        response = self.provider_client.post(
            reverse("create_product"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(response.data, self.valid_payload)
        self.assertGreater(len(mail.outbox), 0)


class ListPendingProductRequests(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.unactive_amount = 20
        active_amount = 20

        user = UserFactory.create()
        provider = ProviderFactory.create(user=user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        # Create pending products
        ProductFactory.create_batch(self.unactive_amount,
                                    provider=provider,
                                    category=category,
                                    laboratory=laboratory,
                                    )
        # Create active products
        ProductFactory.create_batch(active_amount, provider=provider,
                                    category=category, laboratory=laboratory,
                                    status=Product.ACCEPTED)

    def test_require_authentication(self) -> None:
        response = self.anonymous.get(
            reverse("list_products"),
            {"status": Product.PENDING},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_list_pending_products(
        self,
    ) -> None:
        response = self.admin_client.get(
            reverse("list_products"),
            {"status": Product.PENDING},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result), self.unactive_amount)
        for product in result:
            self.assertEqual(product["status"], Product.PENDING)


class UpdateProduct(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        user = UserFactory.create()
        provider = ProviderFactory.create(user=user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        self.animal_groups = AnimalGroupFactory.create_batch(5)
        self.product = ProductFactory.create(
            provider=provider, category=category,
            laboratory=laboratory
        )

    def test_require_authentication(self) -> None:
        response = self.anonymous.put(
            reverse("update_product", kwargs={"pk": self.product.pk}),
            data=json.dumps([]),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_error_if_product_not_found(self) -> None:
        response = self.admin_client.put(
            reverse("update_product", kwargs={"pk": 99999999}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_update_product_test(self) -> None:
        mail.outbox = []
        new_product = self.product
        new_product.status = Product.ACCEPTED
        valid_product = CreateProductSerializer(
            new_product,
        ).data
        valid_product["animal_groups"] = [
            group.id for group in self.animal_groups]
        response = self.admin_client.put(
            reverse("update_product", kwargs={"pk": self.product.pk}),
            data=json.dumps(valid_product),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data["pk"], self.product.pk)
        self.assertEqual(response.data["status"], Product.ACCEPTED)
        # Creates new m2m animal group relation instances
        self.assertEqual(len(response.data["animal_groups"]),
                         len(self.animal_groups))
        self.assertGreater(len(mail.outbox), 0)


class DetailProduct(BaseTestCase):
    def setUp(self):
        super().setUp()
        user = UserFactory.create()
        provider = ProviderFactory.create(user=user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        self.product = ProductFactory.create(
            provider=provider, category=category,
            laboratory=laboratory
        )

    def test_require_authentication(self) -> None:
        response = self.anonymous.get(
            reverse("detail_product", kwargs={"pk": self.product.pk}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_error_if_product_not_found(self) -> None:
        response = self.admin_client.get(
            reverse("detail_product", kwargs={"pk": 99999999}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_get_product_detail(self) -> None:
        response = self.admin_client.get(
            reverse("detail_product", kwargs={"pk": self.product.pk}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        serializer = ProductSerializer(self.product)
        self.assertEqual(serializer.data, response.data)


class ListAllActiveProductsOfProvider(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        user = UserFactory.create()
        other_user = UserFactory.create()

        self.provider = ProviderFactory.create(user=user)
        other_provider = ProviderFactory.create(user=other_user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()

        ProductFactory.create_batch(20,
                                    provider=self.provider,
                                    category=category,
                                    laboratory=laboratory
                                    )
        ProductFactory.create_batch(5,
                                    provider=self.provider,
                                    category=category,
                                    laboratory=laboratory,
                                    status=Product.ACCEPTED)
        ProductFactory.create_batch(10, provider=other_provider,
                                    category=category,
                                    laboratory=laboratory,
                                    status=Product.ACCEPTED)

    def test_require_authentication(self) -> None:
        response = self.anonymous.get(
            reverse("list_products"),
            {
                "provider": self.provider.id,
                "status": Product.ACCEPTED
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_list_only_products_of_provider(
        self,
    ) -> None:
        response = self.admin_client.get(
            reverse("list_products"),
            {
                "provider": self.provider.id,
                "status": Product.ACCEPTED
            },
            content_type="application/json",
        )
        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result), 5)
        for product in result:
            self.assertEqual(product["provider"], self.provider.name)


class ListAllProductSelectOptions(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        user = UserFactory.create()
        self.lab_quantity = 10
        self.category_quantity = 20
        self.animal_groups_quantity = 5
        self.provider = ProviderFactory.create(user=user)
        CategoryFactory.create_batch(self.category_quantity)
        LaboratoryFactory.create_batch(self.lab_quantity)
        AnimalGroupFactory.create_batch(self.animal_groups_quantity)

    def test_require_authentication(self) -> None:
        response = self.anonymous.get(
            reverse("list_product_options"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def list_all_select_product_options(
        self,
    ) -> None:
        response = self.provider_client.get(
            reverse("list_product_options"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)

        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result["laboratories"]), self.lab_quantity)
        self.assertEqual(len(result["categories"]), self.category_quantity)
        self.assertEqual(len(
            result["animal_groups"]), self.animal_groups_quantity)


class RequestProductPriceChange(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()

        self.provider = ProviderFactory.create(user=self.provider_user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()

        self.product = ProductFactory.create(
            provider=self.provider,
            category=category,
            laboratory=laboratory
        )
        self.expected_price = 500.
        self.valid_payload = {
            "price": self.expected_price,
            "token": self.provider.token,
            "product": self.product.pk,
        }
        self.invalid_payload = {
            "price": self.expected_price,
            "product": self.product.pk,
            "token": "12345678",
        }
        self.kwargs = {"pk": self.product.pk}

    def test_product_price_change_request_should_be_successful(self) -> None:
        response = self.provider_client.patch(
            reverse("request_price_change", kwargs=self.kwargs),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )

        result = json.loads(json.dumps(response.data))

        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(float(result["new_price"]), self.expected_price)

        self.provider.refresh_from_db(fields=["token_used"])
        self.assertEqual(self.provider.token_used, True)

    def test_product_price_change_request_should_fail_with_no_access(self) -> None:
        response = self.service_client.patch(
            reverse("request_price_change", kwargs=self.kwargs),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_product_price_change_request_should_fail_with_invalid_token(
        self,
    ) -> None:
        response = self.provider_client.patch(
            reverse("request_price_change", kwargs=self.kwargs),
            data=json.dumps(self.invalid_payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)

