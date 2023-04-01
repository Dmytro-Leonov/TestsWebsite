from django.core.exceptions import ValidationError
from django.test import TestCase

from tests_website.users.models import User


class UserTests(TestCase):
    def test_user_create_first_name_and_email_are_mandatory(self):
        with self.assertRaises(ValidationError):
            User.objects.create_user(
                full_name="",
                email="test@test.test"
            )
        with self.assertRaises(ValidationError):
            User.objects.create_user(
                full_name="Test User",
                email=""
            )

    def test_create_superuser(self):
        user = User.objects.create_superuser(
            full_name="Test User",
            email="test@test.test",
        )

        self.assertTrue(user.is_active)
        self.assertTrue(user.is_admin)
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff())
        self.assertEqual(user.email, str(user))



