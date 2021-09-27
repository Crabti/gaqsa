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
from order.factories.order import (
    OrderFactory,
    RequisitionFactory
)
from order.models import (
    Order,
    Requisition
)
from order.serializers import (
    OrderSerializer,
    RequisitionSerializer
)
from providers.factories.provider import ProviderFactory
from users.factories.user import UserFactory


class CreateOrderTest(TestCase):
    def setUp(self) -> None:
        user = UserFactory.create()
        provider = ProviderFactory.create(user=user)
        self.product = ProductFactory.create(provider=provider)
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
