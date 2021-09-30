from users.factories.user import UserFactory
from backend.utils.tests import BaseTestCase
import json
from http import HTTPStatus
from products.factories.laboratory import LaboratoryFactory
from products.factories.category import CategoryFactory

from django.urls import reverse

from products.factories.product import ProductFactory

from order.factories.order import (
    OrderFactory,
    RequisitionFactory
)


from providers.factories.provider import ProviderFactory


class ListOrderTest(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        provider = ProviderFactory.create(user=self.provider_user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        product = ProductFactory.create(
            provider=provider,
            category=category,
            laboratory=laboratory
        )
        self.orders_amount = 10
        requisitions_per_order = 3
        # Create multiple orders with random users and a list of requisitions
        for i in range(self.orders_amount):
            user = UserFactory.create()
            order = OrderFactory.create(user=user)
            RequisitionFactory.create_batch(
                requisitions_per_order,
                provider=provider,
                order=order,
                product=product
            )

    def test_list_all_orders_admin(self) -> None:
        response = self.admin_client.get(
            reverse("list_order"),
            content_type="application/json",
        )
        result = json.loads(json.dumps(response.data))
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(result), self.orders_amount)

    def test_list_client_history_orders(self) -> None:
        my_orders = OrderFactory.create_batch(5, user=self.client_user)
        response = self.service_client.get(
            reverse("list_order"),
            content_type="application/json",
        )
        result = json.loads(json.dumps(response.data))
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(result), len(my_orders))
