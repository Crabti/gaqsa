from http import HTTPStatus

from django.test import TestCase
from django.urls import reverse

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
