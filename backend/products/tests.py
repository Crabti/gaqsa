import json
from http import HTTPStatus

from django.test import TestCase
from django.urls import reverse

from products.factories.product import ProductFactory
from products.models import Product
from products.serializers.product import (
    CreateProductSerializer
)
from providers.factories.provider import ProviderFactory
from users.factories.user import UserFactory


class RegisterRequestToCreateProduct(TestCase):
    def setUp(self) -> None:
        user = UserFactory.create()
        provider = ProviderFactory.create(user=user)
        product = ProductFactory.build(provider=provider)
        self.valid_payload = CreateProductSerializer(
            product,
        ).data

    def test_request_to_create_product_with_valid_data_should_succeed(
        self,
    ) -> None:
        response = self.client.post(
            reverse("request_product"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(response.data, self.valid_payload)


class ListPendingProductRequests(TestCase):
    def setUp(self) -> None:
        self.unactive_amount = 20
        active_amount = 20

        user = UserFactory.create()
        provider = ProviderFactory.create(user=user)
        # Create pending products
        ProductFactory.create_batch(self.unactive_amount, provider=provider)
        # Create active products
        ProductFactory.create_batch(active_amount, provider=provider,
                                    status=Product.ACCEPTED)

    def test_request_to_create_product_with_valid_data_should_succeed(
        self,
    ) -> None:
        response = self.client.get(
            reverse("pending_product_requests"),
            content_type="application/json",
        )
        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result), self.unactive_amount)
        for product in result:
            self.assertEqual(product['status'], Product.PENDING)


class ListAllProducts(TestCase):
    def setUp(self) -> None:
        self.unactive_amount = 20
        active_amount = 20

        user = UserFactory.create()
        self.provider = ProviderFactory.create(user=user)
        # Create pending products
        ProductFactory.create_batch(self.unactive_amount,
                                    provider=self.provider)
        # Create active products
        ProductFactory.create_batch(active_amount, provider=self.provider,
                                    status=Product.ACCEPTED)

    def test_list_all_products(
        self,
    ) -> None:
        response = self.client.get(
            reverse("list_all_products", kwargs={'pk': self.provider.id}),
            content_type="application/json",
        )
        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result), self.unactive_amount)
        for product in result:
            self.assertEqual(product['status'], Product.ACCEPTED)
            self.assertEqual(product['provider'], self.provider.id)
