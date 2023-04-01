from django.test import TestCase

from tests_website.common.utils import get_object
from tests_website.users.models import User


class GetObjectTests(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            full_name="Test User",
            email="test@test.test",
        )
        self.user2 = User.objects.create_user(
            full_name="Test User 2",
            email="test2@test.test",
        )

    def test_get_object_returns_object_from_queryset(self):
        self.assertEqual(self.user, get_object(User.objects.all(), id=self.user.id))

    def test_get_object_returns_object_from_model(self):
        self.assertEqual(self.user, get_object(User, id=self.user.id))

    def test_get_object_returns_none_if_object_does_not_exist_from_queryset(self):
        self.assertIsNone(get_object(User, id=999))

    def test_get_object_returns_none_if_object_does_not_exist_from_model(self):
        self.assertIsNone(get_object(User, id=999))
