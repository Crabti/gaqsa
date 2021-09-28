from http import HTTPStatus
from products.factories.laboratory import LaboratoryFactory
from products.factories.category import CategoryFactory

from django.test import TestCase
from django.urls import reverse

from products.factories.product import ProductFactory

from order.factories.order import (
    OrderFactory,
    RequisitionFactory
)


from providers.factories.provider import ProviderFactory
from users.factories.user import UserFactory


class CreateOrderTest(TestCase):
    def setUp(self) -> None:
        user = UserFactory.create()
        provider = ProviderFactory.create(user=user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        self.product = ProductFactory.create(
            provider=provider,
            category=category,
            laboratory=laboratory
        )
        self.order = OrderFactory.create(user=user)
        self.requisition = RequisitionFactory.create(
            provider=provider,
            order=self.order,
            product=self.product
        )

    def test_create_order(self) -> None:
        response = self.client.get(
            reverse("list_order"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
