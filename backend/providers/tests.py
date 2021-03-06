import json
from django.core import mail
from providers.models import Provider
from providers.serializers.providers import ProviderPkSerializer

from backend.utils.tests import BaseTestCase
from users.factories.user import UserFactory
from providers.factories.provider import ProviderFactory

from django.urls import reverse
from http import HTTPStatus
from datetime import date


class CreateCodeForProvider(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.providers = [
            ProviderFactory.create(user=UserFactory.create()),
            ProviderFactory.create(user=UserFactory.create()),
            ProviderFactory.create(user=UserFactory.create()),
        ]
        self.token_apply_date = date.today()
        self.valid_payload = {
            'providers': ProviderPkSerializer(
                self.providers, many=True).data,
            'token_apply_date': str(self.token_apply_date)
        }

    def test_require_authentication(self) -> None:
        response = self.anonymous.put(
            reverse("create_code"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_new_code(self) -> None:
        mail.outbox = []
        response = self.admin_client.put(
            reverse("create_code"),
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        for provider in self.providers:
            provider = Provider.objects.get(pk=provider.pk)
            self.assertNotEqual(provider.token, None)
            self.assertEqual(provider.token_apply_date, self.token_apply_date)
        self.assertEqual(len(mail.outbox), len(self.providers))


class ListAllProviders(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.providers_quantity = 20
        self.providers = ProviderFactory.create_batch(
            self.providers_quantity,
        )

    def test_require_authentication(self) -> None:
        response = self.anonymous.get(
            reverse("list_providers"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def list_all_providers(
        self,
    ) -> None:
        response = self.admin_user.get(
            reverse("list_providers"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)

        result = json.loads(json.dumps(response.data))
        self.assertEqual(len(result), self.providers_quantity)
