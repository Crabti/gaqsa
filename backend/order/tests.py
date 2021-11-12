from django.contrib.auth.models import User
from users.factories.user import UserFactory
from backend.utils.tests import BaseTestCase
import json
from http import HTTPStatus
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
        product = ProductFactory.create(
            category=category,
        )
        self.orders_amount = 10
        requisitions_per_order = 3
        # Create multiple orders with random users and a list of requisitions
        for i in range(self.orders_amount):
            user = UserFactory.create()
            order = OrderFactory.create(user=user,provider=provider)
            RequisitionFactory.create_batch(
                requisitions_per_order,
                order=order,
                product=product
            )

    def test_require_authentication(self) -> None:
        response = self.anonymous.get(
            reverse("list_order"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_list_all_orders_admin(self) -> None:
        response = self.admin_client.get(
            reverse("list_order"),
            content_type="application/json",
        )
        result = json.loads(json.dumps(response.data))
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(result), self.orders_amount)

    def test_list_client_history_orders(self) -> None:
        other_user = UserFactory.create()
        provider = ProviderFactory.create(user=other_user)
        my_orders = OrderFactory.create_batch(5, user=self.client_user, provider=provider)
        response = self.service_client.get(
            reverse("list_order"),
            content_type="application/json",
        )
        result = json.loads(json.dumps(response.data))
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(len(result), len(my_orders))


class ListRequisitions(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        user = UserFactory.create()
        self.provider = ProviderFactory.create(user=self.provider_user)
        category = CategoryFactory.create()
        product = ProductFactory.create(
            category=category,
        )
        self.orders_amount = 10
        self.requisitions_per_order = 3

        other_user = UserFactory.create()
        other_provider = ProviderFactory.create(user=other_user)

        # Order and requisitiosn from other provider
        for i in range(self.orders_amount):
            user = UserFactory.create()
            order = OrderFactory.create(user=user, provider=other_provider)
            RequisitionFactory.create_batch(
                self.requisitions_per_order,
                order=order,
                product=product
            )

        # Orders with my requistiions
        for i in range(self.orders_amount):
            user = UserFactory.create()
            order = OrderFactory.create(user=user, provider=self.provider)
            RequisitionFactory.create_batch(
                self.requisitions_per_order,
                order=order,
                product=product
            )

    def test_require_authentication(self) -> None:
        response = self.anonymous.get(
            reverse("list_requisitions"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_list_provider_order(self) -> None:
        response = self.provider_client.get(
            reverse("list_order"),
            content_type="application/json",
        )
        result = json.loads(json.dumps(response.data))
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertEqual(
            len(result), self.orders_amount
        )
        for order in result:
            self.assertEqual(order['provider'], self.provider.name)
