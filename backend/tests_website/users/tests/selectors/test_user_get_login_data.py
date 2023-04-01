from django.test import TestCase

from tests_website.users.models import User
from tests_website.users.selectors import user_get_login_data


class UserGetLoginDataTests(TestCase):
    def test_user_get_login_data_returns_correct_data(self):
        user = User.objects.create(
            full_name="Test Name",
            email="test@test.test",
            is_active=True,
            is_admin=False,
            is_superuser=False,
        )

        data = user_get_login_data(user=user)

        self.assertEqual(data, {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "is_active": user.is_active,
            "is_admin": user.is_admin,
            "is_superuser": user.is_superuser,
        })
