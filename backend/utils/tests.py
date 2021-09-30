from users.factories.user import UserFactory
from django.test import TestCase, Client
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group


class BaseTestCase(TestCase):
    def setUp(self) -> None:
        # Create provider user and client for convenient use
        provider_password = 'client'
        self.provider_user = UserFactory.create(
            password=make_password(provider_password)
        )
        provider_group = Group.objects.get(name='Proveedor')
        self.provider_user.groups.add(provider_group)
        self.provider_client = Client()
        self.provider_client.login(
            username=self.provider_user.username,
            password=provider_password
        )

        # Create provider user and client for convenient use
        client_password = 'client'
        self.client_user = UserFactory.create(
            password=make_password(client_password)
        )
        client_group = Group.objects.get(name='Cliente')
        self.client_user.groups.add(client_group)
        # Not named client so we dont override the already existing self.client
        self.service_client = Client()
        self.service_client.login(
            username=self.client_user.username,
            password=client_password
        )
