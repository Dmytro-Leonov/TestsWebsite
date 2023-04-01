from django.test import TestCase

from tests_website.users.models import User
from tests_website.users.services import user_get_or_create


class UserGetOrCreateTests(TestCase):
    def test_user_is_created_if_it_does_not_exist(self):
        user, created = user_get_or_create(email="test@test.test", full_name="Test Test")
        self.assertEqual(created, True)
        self.assertEqual(user.email, "test@test.test")
        self.assertEqual(user.full_name, "Test Test")
        self.assertEqual(user.is_active, True)
        self.assertEqual(user.is_admin, False)
        self.assertEqual(user.is_superuser, False)

    def test_user_is_not_created_if_it_exists(self):
        user_in_db = User.objects.create_user(email="test@test.test", full_name="Test Test")
        user, created = user_get_or_create(email="test@test.test", full_name="Test Test")
        self.assertEqual(created, False)
        self.assertEqual(user, user_in_db)



