from django.test import TestCase


class FailTest(TestCase):

    def test_this_should_fail(
        self,
    ) -> None:
        self.assertEqual(False, True)
