from django.test import TestCase

from tests_website.authentication.services import knox_login
from tests_website.users.services import user_create


class KnoxLoginTestCase(TestCase):
    def test_knox_login(self):
        user = user_create(full_name="Test Test", email="test@test.test")
        response = knox_login(user=user)

        self.assertEqual(response.status_code, 302)


