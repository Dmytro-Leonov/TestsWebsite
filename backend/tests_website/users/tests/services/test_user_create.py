from django.core.exceptions import ValidationError
from django.test import TestCase

from tests_website.users.models import User
from tests_website.users.services import user_create


class UserCreateTests(TestCase):
    def test_user_without_password_is_created_with_unusable_one(self):
        user = user_create(full_name="Test Name", email="test@test.test")

        self.assertFalse(user.has_usable_password())

    def test_user_with_capitalized_email_cannot_be_created(self):
        user_create(full_name="Test Name", email="test@test.test")

        with self.assertRaises(ValidationError):
            user_create(full_name="Test Name", email="TEST@test.test")

        self.assertEqual(1, User.objects.count())
