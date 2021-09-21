import json
from http import HTTPStatus

from django.test import TestCase
from django.urls import reverse

from products.factories.product import ProductFactory
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

    def test_list_pending_products(
        self,
    ) -> None:
        response = self.client.get(
            reverse("pending_product_requests"),
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
        self.product = ProductFactory.create(provider=provider)

    def test_error_if_product_not_found(self) -> None:
        response = self.client.put(
            reverse("manage_product", kwargs={'pk': 99999999}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_update_product_test(self) -> None:
        new_product = self.product
        new_product.status = Product.ACCEPTED
        valid_product = CreateProductSerializer(
            new_product,
        ).data
        response = self.client.put(
            reverse("manage_product", kwargs={'pk': self.product.pk}),
            data=json.dumps(valid_product),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(response.data['status'], Product.ACCEPTED)


class DetailProductTest(TestCase):
    def setUp(self):
        user = UserFactory.create()
        provider = ProviderFactory.create(user=user)
        self.product = ProductFactory.create(provider=provider)

    def test_error_if_product_not_found(self) -> None:
        response = self.client.get(
            reverse("manage_product", kwargs={'pk': 99999999}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.NOT_FOUND)

    def test_get_product_detail(self) -> None:
        response = self.client.get(
            reverse("manage_product", kwargs={'pk': self.product.pk}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        serializer = ProductSerializer(self.product)
        self.assertEqual(serializer.data, response.data)


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
