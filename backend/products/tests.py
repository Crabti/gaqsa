import json
from http import HTTPStatus

from django.test import TestCase
from django.urls import reverse

from products.factories.product import ProductFactory
from products.serializers.product import CreateProductSerializer


class RegisterRequestToCreateProduct(TestCase):
    def setUp(self) -> None:
        self.valid_payload = CreateProductSerializer(
            ProductFactory.build(),
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
