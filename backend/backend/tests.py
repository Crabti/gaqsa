from backend.utils.groups import is_admin, is_client, is_provider
from backend.utils.tests import BaseTestCase


class GroupsUtilsTest(BaseTestCase):
    def test_is_provider(self) -> None:
        self.assertTrue(is_provider(self.provider_user))

    def test_is_admin(self) -> None:
        self.assertTrue(is_admin(self.admin_user))

    def test_is_client(self) -> None:
        self.assertTrue(is_client(self.client_user))
