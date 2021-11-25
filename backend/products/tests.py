from datetime import date, timedelta
import json
from http import HTTPStatus

from django.urls import reverse
from django.core import mail

from products.factories.product import (
    ProductFactory, ProductProviderFactory
)
from products.factories.laboratory import LaboratoryFactory
from products.factories.category import CategoryFactory
from products.factories.animal_groups import AnimalGroupFactory

from products.models import Product, ProductProvider
from products.serializers.product import (
    CreateProductProviderSerializer,
    ProductSerializer,
    UpdateProductSerializer
)
from providers.factories.provider import ProviderFactory
from users.factories.user import UserFactory

from backend.utils.tests import BaseTestCase


class RegisterRequestToCreateProduct(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.provider = ProviderFactory.create(user=self.provider_user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        animal_groups = AnimalGroupFactory.create_batch(5)
        product = ProductFactory.build(
            category=category
        )
        provider = ProductProviderFactory.build(
            laboratory=laboratory,
        )
        provider_payload = CreateProductProviderSerializer(
            provider
        ).data

        self.valid_payload = ProductSerializer(
            product,
        ).data

        self.valid_payload['provider'] = provider_payload

        # Override serializer field to add m2m objects
        self.valid_payload["animal_groups"] = [
            group.id for group in animal_groups
        ]

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
        response = self.provider_client.post(
            reverse("create_product"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        # Creates product - provider relation
        product_providers = ProductProvider.objects.all().count()
        self.assertEqual(product_providers, 1)
        # Registered as me
        product_provider = ProductProvider.objects.get(
            provider=self.provider
        )
        self.assertNotEqual(product_provider, None)
        result = json.loads(json.dumps(response.data))
        self.assertEqual(result['status'], Product.PENDING)


class RegisterRequestToCreateProductAsAdmin(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        user = UserFactory.create()
        provider = ProviderFactory.create(user=user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        animal_groups = AnimalGroupFactory.create_batch(5)
        product = ProductFactory.build(
            category=category
        )
        provider = ProductProviderFactory.build(
            laboratory=laboratory,
            provider=provider
        )
        provider_payload = CreateProductProviderSerializer(
            provider
        ).data

        self.valid_payload = ProductSerializer(
            product,
        ).data

        self.valid_payload['provider'] = provider_payload

        # Override serializer field to add m2m objects
        self.valid_payload["animal_groups"] = [
            group.id for group in animal_groups
        ]

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
        response = self.admin_client.post(
            reverse("create_product"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        result = json.loads(json.dumps(response.data))
        self.assertEqual(result['status'], Product.ACCEPTED)


class AcceptProductRequestAsNew(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        category = CategoryFactory.create()
        self.products = ProductFactory.create_batch(
            5,
            category=category,
        )
        laboratory = LaboratoryFactory.create()
        self.original_price = 10
        self.original_iva = 0.2

        self.new_price = 20
        self.new_iva = 0.5

        for product in self.products:
            ProductProviderFactory.create(
                product=product,
                price=self.original_price,
                iva=self.original_iva,
                laboratory=laboratory,
                provider=ProviderFactory.create()
            )
        self.valid_payload = [
            {
                'id': product.id,
                'price': self.new_price,
                'iva': self.new_iva,
                'laboratory': laboratory.id
            }
            for product in self.products
        ]

    def test_require_authentication(self) -> None:
        response = self.anonymous.post(
            reverse("accept_products"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_require_admin(self) -> None:
        response = self.provider_client.post(
            reverse("accept_products"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_accept_products_request_should_succeed(
        self,
    ) -> None:
        response = self.admin_client.post(
            reverse("accept_products"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        for product in self.products:
            product.refresh_from_db(fields=["status"])
            self.assertEqual(product.status, Product.ACCEPTED)
            providers = product.providers.all()
            for provider in providers:
                self.assertEqual(provider.price, self.new_price)
                self.assertEqual(provider.iva, self.new_iva)


class RejectProductRequest(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        category = CategoryFactory.create()
        self.products = ProductFactory.create_batch(
            5,
            category=category,
        )
        self.reject_reason = "RECHAZADO..."
        self.valid_payload = {
            "products": [
                product.id for product in self.products
            ],
            "reject_reason": self.reject_reason
        }

    def test_require_authentication(self) -> None:
        response = self.anonymous.post(
            reverse("reject_products"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_require_admin(self) -> None:
        response = self.provider_client.post(
            reverse("reject_products"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_accept_products_request_should_succeed(
        self,
    ) -> None:
        response = self.admin_client.post(
            reverse("reject_products"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        for product in self.products:
            product.refresh_from_db(fields=["status", "reject_reason"])
            self.assertEqual(product.status, Product.REJECTED)
            self.assertEqual(product.reject_reason, self.reject_reason)


class GroupProducts(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.target_product = ProductFactory.create()
        self.product_requests = [
            ProductProviderFactory.create(
                product=ProductFactory.create(),
                provider=ProviderFactory.create(),
                laboratory=LaboratoryFactory.create()
            ),
            ProductProviderFactory.create(
                product=ProductFactory.create(),
                provider=ProviderFactory.create(),
                laboratory=LaboratoryFactory.create()
            ),
            ProductProviderFactory.create(
                product=ProductFactory.create(),
                provider=ProviderFactory.create(),
                laboratory=LaboratoryFactory.create()
            ),
        ]
        self.other_lab = LaboratoryFactory.create()
        self.valid_payload = {
            "product": self.target_product.id,
            "providers": [
                {
                  'id': product_provider.id,
                  'price': 50,
                  'iva': 0.2,
                  'laboratory': self.other_lab.pk,
                }
                for product_provider in self.product_requests
            ]
        }

    def test_require_authentication(self) -> None:
        response = self.anonymous.post(
            reverse("group_products"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_require_admin(self) -> None:
        response = self.provider_client.post(
            reverse("group_products"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_accept_products_request_should_succeed(
        self,
    ) -> None:
        response = self.admin_client.post(
            reverse("group_products"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        providers = self.target_product.providers
        self.assertEqual(
            len(providers), len(self.product_requests)
        )
        for provider in providers:
            self.assertEqual(provider.price, 50)
            self.assertEqual(float(provider.iva), float(0.2))
            self.assertEqual(provider.laboratory, self.other_lab)


class ListProducts(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.active_amount = 20
        category = CategoryFactory.create()
        ProductFactory.create_batch(
            self.active_amount,
            category=category,
            status=Product.ACCEPTED
        )

    def test_require_authentication(self) -> None:
        response = self.anonymous.get(
            reverse("list_products"),
            {"status": Product.ACCEPTED},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_list_accepted_products(
        self,
    ) -> None:
        response = self.admin_client.get(
            reverse("list_products"),
            {"status": Product.ACCEPTED},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result), self.active_amount)
        for product in result:
            self.assertEqual(product['status'], Product.ACCEPTED)


class ListPendingProducts(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.unactive_amount = 20

        category = CategoryFactory.create()

        ProductFactory.create_batch(
            self.unactive_amount,
            category=category,
            status=Product.PENDING,
        )

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
            self.assertEqual(product['status'], Product.PENDING)


class UpdateProduct(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        category = CategoryFactory.create()
        self.animal_groups = AnimalGroupFactory.create_batch(5)
        self.product = ProductFactory.create(
            category=category,
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
        new_product = self.product
        valid_product = UpdateProductSerializer(
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
        # Creates new m2m animal group relation instances
        self.assertEqual(len(response.data["animal_groups"]),
                         len(self.animal_groups))


class DetailProduct(BaseTestCase):
    def setUp(self):
        super().setUp()
        category = CategoryFactory.create()
        self.product = ProductFactory.create(
            category=category,
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
        other_user = UserFactory.create()

        self.provider = ProviderFactory.create(user=self.provider_user)
        other_provider = ProviderFactory.create(user=other_user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()

        products = ProductFactory.create_batch(
            20,
            category=category,
            status=Product.ACCEPTED
        )
        for product in products:
            ProductProvider.objects.create(
                provider=self.provider,
                product=product,
                laboratory=laboratory
            )
        products = ProductFactory.create_batch(
            10,
            category=category,
            status=Product.PENDING
        )
        for product in products:
            ProductProvider.objects.create(
                provider=other_provider,
                product=product,
                laboratory=laboratory
            )

    def test_require_authentication(self) -> None:
        response = self.anonymous.get(
            reverse("list_products"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_list_only_products_of_provider(
        self,
    ) -> None:
        response = self.provider_client.get(
            reverse("list_products"),
            content_type="application/json",
        )
        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result), 20)
        self.assertEqual(response.status_code, HTTPStatus.OK)


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

        self.provider = ProviderFactory.create(
            user=self.provider_user,
            token='BACSO',
            token_apply_date=date.today()
        )
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()

        self.products = ProductFactory.create_batch(
            10,
            category=category,
        )
        for product in self.products:
            ProductProviderFactory.create(
                product=product,
                provider=self.provider,
                laboratory=laboratory,
            )
        self.expected_price = 500.

        self.products_payload = [
            {
                "product": product.pk,
                "new_price": self.expected_price
            }
            for product in self.products
        ]

        self.valid_payload = {
            "token": self.provider.token,
            "products": self.products_payload,
        }

        self.invalid_payload = {
            "products": self.products_payload,
            "token": "12345678",
        }

    def test_product_price_change_request_should_be_successful(self) -> None:
        mail.outbox = []
        response = self.provider_client.post(
            reverse("request_price_change"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)

        self.provider.refresh_from_db(fields=["token_used"])
        providers = self.products[0].providers
        for provider in providers:
            self.assertEqual(provider.price, self.expected_price)
        self.assertEqual(self.provider.token_used, True)
        self.assertGreater(len(mail.outbox), 0)

    def test_product_price_change_request_should_fail_with_no_access(
            self,
    ) -> None:
        response = self.service_client.post(
            reverse("request_price_change"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_product_price_change_request_should_fail_with_invalid_token(
        self,
    ) -> None:
        response = self.provider_client.post(
            reverse("request_price_change"),
            data=json.dumps(self.invalid_payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)

    def test_product_price_change_request_should_fail_with_invalid_apply_date(
        self,
    ) -> None:
        self.provider.token_apply_date = date.today() + timedelta(days=2)
        self.provider.save()
        response = self.provider_client.post(
            reverse("request_price_change"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )

        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)


class AddProviderToProduct(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.provider = ProviderFactory.create()
        self.target_product = ProductFactory.create()
        self.other_lab = LaboratoryFactory.create()
        self.valid_price = 20.50
        self.valid_iva = 0.2
        self.valid_payload = {
            'provider': self.provider.pk,
            'price': self.valid_price,
            'iva': self.valid_iva,
            'laboratory': self.other_lab.pk,
        }

    def test_require_authentication(self) -> None:
        response = self.anonymous.post(
            reverse("add_provider", kwargs={'pk': self.target_product.pk}),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_require_admin(self) -> None:
        response = self.provider_client.post(
            reverse("add_provider", kwargs={'pk': self.target_product.pk}),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)
        response = self.service_client.post(
            reverse("add_provider", kwargs={'pk': self.target_product.pk}),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_valid_add_provider_to_product_request_should_succeed(
        self,
    ) -> None:
        response = self.admin_client.post(
            reverse("add_provider", kwargs={'pk': self.target_product.pk}),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertGreater(len(self.target_product.providers), 0)
