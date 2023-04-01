from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from tests_website.users.services import user_create, user_update


class UserUpdateTests(TestCase):
    def setUp(self):
        self.user = user_create(
            full_name="Test User",
            email="test@test.test",
            is_active=True,
            is_admin=False,
            password="test",
        )

        self.data = {
            "full_name": "New Test User",
            "email": "newtest@test.test",
            "is_active": False,
            "is_admin": True,
            "is_superuser": True
        }

    def test_user_update(self):
        user = user_update(user=self.user, data=self.data)

        self.assertEqual(user.full_name, self.data["full_name"])
        self.assertNotEqual(user.email, self.data["email"])
        self.assertEqual(user.is_active, self.data["is_active"])
        self.assertEqual(user.is_admin, self.data["is_admin"])
        self.assertNotEqual(user.is_superuser, self.data["is_superuser"])

