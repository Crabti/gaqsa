from users.factories.user import UserFactory
from django.test import TestCase
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from django.urls import reverse
from http import HTTPStatus
from rest_framework.test import APIClient


class BaseTestCase(TestCase):
    def setUp(self) -> None:
        # Create provider user and client for convenient use
        provider_password = 'provider'
        self.provider_user = UserFactory.create(
            password=make_password(provider_password)
        )
        provider_group = Group.objects.get(name='Proveedor')
        self.provider_user.groups.add(provider_group)
        self.provider_client = APIClient()
        response = self.provider_client.post(
            reverse('login'),
            {
                'username': self.provider_user.username,
                'password': provider_password
            }
        )
        self.assertTrue(response.status_code, HTTPStatus.OK)
        self.provider_client.credentials(
            HTTP_AUTHORIZATION="Bearer " + response.data['access']
        )

        # Create provider user and client for convenient use
        client_password = 'client'
        self.client_user = UserFactory.create(
            password=make_password(client_password)
        )
        client_group = Group.objects.get(name='Cliente')
        self.client_user.groups.add(client_group)
        # Not named client so we dont override the already existing self.client
        self.service_client = APIClient()
        response = self.service_client.post(
            reverse('login'),
            {
                'username': self.client_user.username,
                'password': client_password,
            }
        )
        self.assertTrue(response.status_code, HTTPStatus.OK)
        self.service_client.credentials(
            HTTP_AUTHORIZATION="Bearer " + response.data['access'],
        )
        # Create admin user and client for convenient use
        admin_password = 'admin'
        self.admin_user = UserFactory.create(
            password=make_password(admin_password)
        )
        admin_group = Group.objects.get(name='Administrador')
        self.admin_user.groups.add(admin_group)
        self.admin_client = APIClient()
        response = self.admin_client.post(
            reverse('login'),
            {
                'username': self.admin_user.username,
                'password': admin_password
            }
        )
        self.admin_client.credentials(
            HTTP_AUTHORIZATION="Bearer " + response.data['access']
        )
        self.assertTrue(response.status_code, HTTPStatus.OK)
