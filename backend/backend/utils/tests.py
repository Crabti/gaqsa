from users.factories.user import UserFactory
from django.test import TestCase
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from django.urls import reverse
from http import HTTPStatus
from rest_framework.test import APIClient
from django.conf import settings


class BaseTestCase(TestCase):

    @classmethod
    def setUpTestData(cls) -> None:
        # Faster password hasher
        settings.PASSWORD_HASHERS = [
            'django.contrib.auth.hashers.MD5PasswordHasher'
        ]

        # Create provider user
        cls.provider_password = 'provider'
        cls.provider_user = UserFactory.create(
            password=make_password(cls.provider_password)
        )
        provider_group = Group.objects.get(name='Proveedor')
        cls.provider_user.groups.add(provider_group)
        cls.client_password = 'client'
        cls.client_user = UserFactory.create(
            password=make_password(cls.client_password)
        )
        client_group = Group.objects.get(name='Cliente')
        cls.client_user.groups.add(client_group)
        cls.admin_password = 'admin'
        cls.admin_user = UserFactory.create(
            password=make_password(cls.admin_password)
        )
        admin_group = Group.objects.get(name='Administrador')
        cls.admin_user.groups.add(admin_group)
        return super().setUpTestData()

    def setUp(self) -> None:
        # Anonymous client
        self.anonymous = APIClient()

        self.provider_client = APIClient()
        response = self.provider_client.post(
            reverse('login'),
            {
                'username': self.provider_user.username,
                'password': self.provider_password
            }
        )
        self.provider_client.credentials(
            HTTP_AUTHORIZATION="Bearer " + response.data['access']
        )

        # Not named client so we dont override the already existing self.client
        self.service_client = APIClient()
        response = self.service_client.post(
            reverse('login'),
            {
                'username': self.client_user.username,
                'password': self.client_password,
            }
        )
        self.service_client.credentials(
            HTTP_AUTHORIZATION="Bearer " + response.data['access'],
        )

        self.admin_client = APIClient()
        response = self.admin_client.post(
            reverse('login'),
            {
                'username': self.admin_user.username,
                'password': self.admin_password
            }
        )
        self.admin_client.credentials(
            HTTP_AUTHORIZATION="Bearer " + response.data['access']
        )
