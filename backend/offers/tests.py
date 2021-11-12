import json
from http import HTTPStatus

from django.urls import reverse
from django.core import mail
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from offers.serializers.offer import CreateOfferSerializer

from providers.factories.provider import ProviderFactory

from products.models import Product
from products.factories.laboratory import LaboratoryFactory
from products.factories.category import CategoryFactory
from products.factories.product import ProductFactory, ProductProviderFactory

from offers.factories.offer import OfferFactory

from backend.utils.tests import BaseTestCase
from datetime import date
from datetime import timedelta

from users.factories.user import UserFactory


class CreateOffer(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        provider = ProviderFactory.create(user=self.provider_user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        product = ProductFactory.create(
            status=Product.ACCEPTED,
            category=category
        )
        product_provider = ProductProviderFactory.create(
            laboratory=laboratory,
            product=product,
            provider=provider
        )
        offer = OfferFactory.build(
            product_provider=product_provider
        )
        self.valid_payload = CreateOfferSerializer(
            offer,
        ).data

    def test_require_authentication(self) -> None:
        response = self.anonymous.post(
            reverse("create_offer"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_request_to_create_offer_with_invalid_role_should_fail(
        self
    ) -> None:
        response = self.service_client.post(
            reverse("create_offer"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_request_to_create_offer_with_valid_data_should_succeed(
        self,
    ) -> None:
        mail.outbox = []
        response = self.provider_client.post(
            reverse("create_offer"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        self.assertEqual(response.data, self.valid_payload)
        self.assertGreater(len(mail.outbox), 0)


class OfferExpire(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        category = CategoryFactory.create()
        product = ProductFactory.create(
            status=Product.ACCEPTED,
            category=category,
        )
        laboratory = LaboratoryFactory.create()
        provider = ProviderFactory.create()
        self.product_provider = ProductProviderFactory.create(
            product=product,
            laboratory=laboratory,
            provider=provider
        )

    def test_offer_valid(self) -> None:
        offer = OfferFactory.create(
            user=self.provider_user,
            product_provider=self.product_provider,
        )
        self.assertEqual(offer.active, True)

    def test_offer_cancelled(self) -> None:
        offer = OfferFactory.create(
            user=self.provider_user,
            product_provider=self.product_provider,
            cancelled=True,
        )
        self.assertEqual(offer.active, False)

    def test_offer_date_expired(self) -> None:
        offer = OfferFactory.create(
            user=self.provider_user,
            product_provider=self.product_provider,
            ending_at=date.today() - timedelta(days=7)
        )
        self.assertEqual(offer.active, False)


class OfferCancel(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        category = CategoryFactory.create()
        product = ProductFactory.create(
            status=Product.ACCEPTED,
            category=category,
        )
        laboratory = LaboratoryFactory.create()
        provider = ProviderFactory.create()
        product_provider = ProductProviderFactory.create(
            product=product,
            laboratory=laboratory,
            provider=provider
        )
        self.offer = OfferFactory.create(
            user=self.provider_user,
            product_provider=product_provider,
        )

    def test_require_authentication(self) -> None:
        response = self.anonymous.patch(
            reverse("cancel_offer", kwargs={"pk": self.offer.pk}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_require_is_provider_or_admin(self) -> None:
        response = self.service_client.patch(
            reverse("cancel_offer", kwargs={"pk": self.offer.pk}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)
        # Create other provider client
        other_provider_client = APIClient()
        other_user = UserFactory.create()
        access = RefreshToken.for_user(other_user).access_token
        other_provider_client.credentials(
            HTTP_AUTHORIZATION="Bearer " + str(access)
        )
        response = other_provider_client.patch(
            reverse("cancel_offer", kwargs={"pk": self.offer.pk}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_cancel_offer_as_owner_should_succeed(self) -> None:
        response = self.provider_client.patch(
            reverse("cancel_offer", kwargs={"pk": self.offer.pk}),
            content_type="application/json",
        )
        print(response.content)
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.offer.refresh_from_db(fields=["cancelled"])
        self.assertEqual(self.offer.cancelled, True)

    def test_cancel_offer_as_admin_should_succeed(self) -> None:
        response = self.admin_client.patch(
            reverse("cancel_offer", kwargs={"pk": self.offer.pk}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.offer.refresh_from_db(fields=["cancelled"])
        self.assertEqual(self.offer.cancelled, True)
