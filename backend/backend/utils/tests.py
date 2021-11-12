from backend.utils.constants import ADMIN_GROUP, CLIENT_GROUP, PROVIDER_GROUP
from clients.factories.client import ClientFactory
from providers.factories.provider import ProviderFactory
from users.factories.user import UserFactory
from django.test import TestCase
from django.contrib.auth.models import Group
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


class BaseTestCase(TestCase):

    @classmethod
    def setUpTestData(cls) -> None:

        cls.provider_user = UserFactory.create()
        cls.provider_obj = ProviderFactory.create(user=cls.provider_user)
        provider_group = Group.objects.get(name=PROVIDER_GROUP)
        cls.provider_user.groups.add(provider_group)

        cls.client_user = UserFactory.create()
        cls.client_obk = ClientFactory.create(user=cls.client_user)
        client_group = Group.objects.get(name=CLIENT_GROUP)
        cls.client_user.groups.add(client_group)

        cls.admin_user = UserFactory.create()
        admin_group = Group.objects.get(name=ADMIN_GROUP)
        cls.admin_user.groups.add(admin_group)
        cls.anonymous = APIClient()

        cls.provider_client = APIClient()
        access = RefreshToken.for_user(cls.provider_user).access_token
        cls.provider_client.credentials(
            HTTP_AUTHORIZATION="Bearer " + str(access)
        )

        # Not named client so we dont override the already existing self.client
        cls.service_client = APIClient()
        access = RefreshToken.for_user(cls.client_user).access_token
        cls.service_client.credentials(
            HTTP_AUTHORIZATION="Bearer " + str(access)
        )

        cls.admin_client = APIClient()
        access = RefreshToken.for_user(cls.admin_user).access_token
        cls.admin_client.credentials(
            HTTP_AUTHORIZATION="Bearer " + str(access)
        )
        return super().setUpTestData()
