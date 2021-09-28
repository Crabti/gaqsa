import json
from http import HTTPStatus

from django.test import TestCase
from django.urls import reverse
from django.core import mail

from products.factories.product import ProductFactory
from products.factories.laboratory import LaboratoryFactory
from products.factories.category import CategoryFactory

from products.models import Product
from products.serializers.product import (
    CreateProductSerializer,
    ProductSerializer
)
from providers.factories.provider import ProviderFactory
from users.factories.user import UserFactory


class RegisterRequestToCreateProduct(TestCase):
    def setUp(self) -> None:
        user = UserFactory.create()
        provider = ProviderFactory.create(user=user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        product = ProductFactory.build(
            provider=provider, status=Product.PENDING,
            category=category, laboratory=laboratory
        )
        self.valid_payload = CreateProductSerializer(
            product,
        ).data

    def test_request_to_create_product_with_valid_data_should_succeed(
        self,
    ) -> None:
        response = self.client.post(
            reverse("create_product"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(response.data, self.valid_payload)
        self.assertGreater(len(mail.outbox), 0)


class ListPendingProductRequests(TestCase):
    def setUp(self) -> None:
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

    def test_list_pending_products(
        self,
    ) -> None:
        response = self.client.get(
            reverse("list_products"),
            {'status': Product.PENDING},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result), self.unactive_amount)
        for product in result:
            self.assertEqual(product['status'], Product.PENDING)


class UpdateProductTest(TestCase):
    def setUp(self) -> None:
        user = UserFactory.create()
        provider = ProviderFactory.create(user=user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        self.product = ProductFactory.create(
            provider=provider, category=category,
            laboratory=laboratory
        )

    def test_error_if_product_not_found(self) -> None:
        response = self.client.put(
            reverse("update_product", kwargs={'pk': 99999999}),
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
        response = self.client.put(
            reverse("update_product", kwargs={'pk': self.product.pk}),
            data=json.dumps(valid_product),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data['pk'], self.product.pk)
        self.assertEqual(response.data['status'], Product.ACCEPTED)
        self.assertGreater(len(mail.outbox), 0)


class DetailProductTest(TestCase):
    def setUp(self):
        user = UserFactory.create()
        provider = ProviderFactory.create(user=user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        self.product = ProductFactory.create(
            provider=provider, category=category,
            laboratory=laboratory
        )

    def test_error_if_product_not_found(self) -> None:
        response = self.client.get(
            reverse("detail_product", kwargs={'pk': 99999999}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_get_product_detail(self) -> None:
        response = self.client.get(
            reverse("detail_product", kwargs={'pk': self.product.pk}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        serializer = ProductSerializer(self.product)
        self.assertEqual(serializer.data, response.data)


class ListAllActiveProductsOfProvider(TestCase):
    def setUp(self) -> None:
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

    def test_list_only_products_of_provider(
        self,
    ) -> None:
        response = self.client.get(
            reverse("list_products"),
            {
                'provider': self.provider.id,
                'status': Product.ACCEPTED
            },
            content_type="application/json",
        )
        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result), 5)
        for product in result:
            self.assertEqual(product['provider'], self.provider.name)
