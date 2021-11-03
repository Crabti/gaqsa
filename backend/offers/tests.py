import json
from http import HTTPStatus

from django.urls import reverse
from django.core import mail
from offers.serializers.offer import CreateOfferSerializer

from providers.factories.provider import ProviderFactory

from products.models import Product
from products.factories.laboratory import LaboratoryFactory
from products.factories.category import CategoryFactory
from products.factories.product import ProductFactory

from offers.factories.offer import OfferFactory

from backend.utils.tests import BaseTestCase
from datetime import date
from datetime import timedelta


class CreateOffer(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        provider = ProviderFactory.create(user=self.provider_user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        product = ProductFactory.create(
            provider=provider,
            status=Product.ACCEPTED,
            category=category, laboratory=laboratory,
        )
        offer = OfferFactory.build(
            product=product
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

    def test_request_to_create_offer_without_product_should_fail(
        self
    ) -> None:

        invalid_offer = OfferFactory.build()
        invalid_payload = CreateOfferSerializer(
            invalid_offer,
        ).data
        response = self.provider_client.post(
            reverse("create_offer"),
            data=json.dumps(invalid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)

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
        provider = ProviderFactory.create(user=self.provider_user)
        category = CategoryFactory.create()
        laboratory = LaboratoryFactory.create()
        self.product = ProductFactory.create(
            provider=provider,
            status=Product.ACCEPTED,
            category=category, laboratory=laboratory,
        )

    def test_offer_valid(self) -> None:
        offer = OfferFactory.create(
            user=self.provider_user,
            product=self.product,
        )
        self.assertEqual(offer.active, True)

    def test_offer_cancelled(self) -> None:
        offer = OfferFactory.create(
            user=self.provider_user,
            product=self.product,
            cancelled=True,
        )
        self.assertEqual(offer.active, False)

    def test_offer_date_expired(self) -> None:
        offer = OfferFactory.create(
            user=self.provider_user,
            product=self.product,
            ending_at=date.today() - timedelta(days=7)
        )
        self.assertEqual(offer.active, False)
