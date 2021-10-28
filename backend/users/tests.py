from http import HTTPStatus
import json

from django.test import TestCase
from django.urls import reverse
from backend.utils.constants import ADMIN_GROUP, CLIENT_GROUP, PROVIDER_GROUP
from providers.models import Provider
from clients.models import Client, Ranch
from users.models import Profile, UserEmail
from clients.serializers.client import CreateClientSerializer
from clients.serializers.ranch import CreateRanchSerializer
from providers.serializers.providers import CreateProviderSerializer
from users.serializers.profile import CreateProfileSerializer
from users.serializers.user_emails import CreateUserEmailSerializer
from backend.utils.tests import BaseTestCase
from users.serializers.users import CreateUserSerializer
from clients.factories.client import ClientFactory
from users.factories.profile import ProfileFactory
from users.factories.user_email import UserEmailFactory
from providers.factories.provider import ProviderFactory
from clients.factories.ranch import RanchFactory
from django.contrib.auth.models import User

from users.factories.user import UserFactory
from django.contrib.auth.hashers import make_password

from backend.faker import sfaker
from rest_framework_simplejwt.tokens import RefreshToken


class UserLogin(TestCase):
    def setUp(self) -> None:
        self.password = sfaker.password()
        self.user = UserFactory.create(password=make_password(self.password))

    def test_login_with_invalid_data_should_fail(
        self,
    ) -> None:

        # Incorrect password
        response = self.client.post(
            reverse("login"),
            data={
                'username': self.user.username,
                'password': self.password + 'oops'
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

        # Incorrect username
        response = self.client.post(
            reverse("login"),
            data={
                'username': self.user.username + 'oops',
                'password': self.password
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_login_with_valid_data_should_succeed(
        self,
    ) -> None:
        response = self.client.post(
            reverse("login"),
            data={
                'username': self.user.username,
                'password': self.password
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertNotEqual(response.data['access'], None)
        self.assertNotEqual(response.data['refresh'], None)

    def test_refresh_with_valid_token_should_succeed(
        self,
    ) -> None:
        refresh = RefreshToken.for_user(self.user)
        response = self.client.post(
            reverse("token_refresh"),
            data={
                'refresh': str(refresh),
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)
        self.assertNotEqual(response.data['access'], None)


class RegisterUser(BaseTestCase):
    def setUp(self) -> None:
        self.user_client = UserFactory.build(
            password="plain_password"
        )
        self.user_provider = UserFactory.build(
            password="plain_password"
        )
        self.ranchs = RanchFactory.build_batch(10)
        self.profile = ProfileFactory.build()
        self.emails = UserEmailFactory.build_batch(10)
        self.client = ClientFactory.build()
        self.provider = ProviderFactory.build()

        self.user_client_payload = CreateUserSerializer(self.user_client)
        self.user_provider_payload = CreateUserSerializer(self.user_provider)

        self.profile_payload = CreateProfileSerializer(self.profile)
        self.ranchs_payload = CreateRanchSerializer(self.ranchs, many=True)
        self.emails_payload = CreateUserEmailSerializer(self.emails, many=True)
        self.client_payload = CreateClientSerializer(self.client)
        self.provider_payload = CreateProviderSerializer(self.provider)

    def test_authentication_required(
        self,
    ) -> None:
        payload = json.dumps({
                "user": self.user_client_payload.data,
                "client": self.client_payload.data,
                "profile": self.profile_payload.data,
                "ranchs": self.ranchs_payload.data,
                "emails": self.emails_payload.data,
                "group": CLIENT_GROUP
            })
        response = self.anonymous.post(
            reverse("create-user"),
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_admin_role_required(
        self,
    ) -> None:
        payload = json.dumps({
                "user": self.user_client_payload.data,
                "client": self.client_payload.data,
                "profile": self.profile_payload.data,
                "ranchs": self.ranchs_payload.data,
                "emails": self.emails_payload.data,
                "group": CLIENT_GROUP
            })
        response = self.provider_client.post(
            reverse("create-user"),
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_transaction_should_rollback_on_fail(
        self,
    ) -> None:
        payload = json.dumps({
                "user": self.user_client_payload.data,
                "client": None,
                "profile": self.profile_payload.data,
                "ranchs": self.ranchs_payload.data,
                "emails": self.emails_payload.data,
                "group": CLIENT_GROUP
            })
        response = self.admin_client.post(
            reverse("create-user"),
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
        self.assertEqual(
            User.objects.filter(username=self.user_client.username).exists(),
            False
        )

    def test_create_client_user_with_valid_data_should_succeed(
        self,
    ) -> None:
        payload = json.dumps({
                "user": self.user_client_payload.data,
                "client": self.client_payload.data,
                "profile": self.profile_payload.data,
                "ranchs": self.ranchs_payload.data,
                "emails": self.emails_payload.data,
                "group": CLIENT_GROUP
            })
        response = self.admin_client.post(
            reverse("create-user"),
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        user = User.objects.get(username=self.user_client.username)
        self.assertNotEqual(user, None)
        self.assertNotEqual(user.password, "plain_password")
        self.assertNotEqual(user.groups.get(name=CLIENT_GROUP), None)
        client = Client.objects.get(user=user.pk)
        self.assertNotEqual(client, None)
        self.assertNotEqual(Profile.objects.get(user=user.pk), None)
        self.assertEqual(Ranch.objects.filter(client=client.pk).count(), 10)
        self.assertEqual(UserEmail.objects.filter(user=user.pk).count(), 10)

    def test_create_provider_user_with_valid_data_should_succeed(
        self,
    ) -> None:
        payload = json.dumps({
                "user": self.user_provider_payload.data,
                "provider": self.provider_payload.data,
                "profile": self.profile_payload.data,
                "emails": self.emails_payload.data,
                "group": PROVIDER_GROUP
            })
        response = self.admin_client.post(
            reverse("create-user"),
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        user = User.objects.get(username=self.user_provider.username)
        self.assertNotEqual(user, None)
        self.assertNotEqual(user.password, "plain_password")
        self.assertNotEqual(user.groups.get(name=PROVIDER_GROUP), None)
        provider = Provider.objects.get(user=user.pk)
        self.assertNotEqual(provider, None)
        self.assertNotEqual(Profile.objects.get(user=user.pk), None)
        self.assertEqual(UserEmail.objects.filter(user=user.pk).count(), 10)

    def test_create_admin_user_with_valid_data_should_succeed(
        self,
    ) -> None:
        payload = json.dumps({
                "user": self.user_provider_payload.data,
                "profile": self.profile_payload.data,
                "group": ADMIN_GROUP
            })
        response = self.admin_client.post(
            reverse("create-user"),
            data=payload,
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.CREATED)
        user = User.objects.get(username=self.user_provider.username)
        self.assertNotEqual(user, None)
        self.assertNotEqual(user.password, "plain_password")
        self.assertNotEqual(user.groups.get(name=ADMIN_GROUP), None)
        self.assertNotEqual(Profile.objects.get(user=user.pk), None)


class ListAllUsers(BaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.users_quantity = 20
        self.users = UserFactory.create_batch(
            self.users_quantity,
        )

    def test_require_authentication(self) -> None:
        response = self.anonymous.get(
            reverse("list_users"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_require_admin_role(self) -> None:
        response = self.service_client.get(
            reverse("list_users"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)
        response = self.provider_client.get(
            reverse("list_users"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.FORBIDDEN)

    def test_list_all_users(
        self,
    ) -> None:
        response = self.admin_client.get(
            reverse("list_users"),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, HTTPStatus.OK)

        result = json.loads(json.dumps(response.data))
        print(result)
        self.assertEqual(len(result), self.users_quantity + 3)
