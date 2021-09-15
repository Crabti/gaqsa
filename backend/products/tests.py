from http import HTTPStatus

from django.test import TestCase
from django.urls import reverse


class RegisterRequestToCreateProduct(TestCase):
    def test_request_to_create_product_with_valid_data_should_succeed(self):
        response = self.client.post(reverse("request_product"))
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
