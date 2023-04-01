from django.test import TestCase

from tests_website.users.models import User
from tests_website.users.selectors import user_list


class UserListTests(TestCase):
    def setUp(self) -> None:
        self.user1 = User.objects.create(
            full_name="Test Name 1",
            email="test@test.test",
            is_active=True,
            is_admin=False,
            is_superuser=False,
        )
        self.user2 = User.objects.create(
            full_name="Test Name 2",
            email="test2@test.test",
            is_active=True,
            is_admin=True,
            is_superuser=False,
        )

    def test_user_list_returns_all_users(self):
        users = user_list()
        self.assertEqual(2, users.count())
        self.assertEqual(self.user1, users[0])
        self.assertEqual(self.user2, users[1])

    def test_user_email_filter_returns_correct_users(self):
        users = user_list(filters={"email": self.user1.email})
        self.assertEqual(1, users.count())
        self.assertEqual(self.user1, users[0])

    def test_user_id_filter_returns_correct_users(self):
        users = user_list(filters={"id": self.user1.id})
        self.assertEqual(1, users.count())
        self.assertEqual(self.user1, users[0])

    def test_user_is_admin_filter_returns_correct_users(self):
        users = user_list(filters={"is_admin": True})
        self.assertEqual(1, users.count())
        self.assertEqual(self.user2, users[0])
