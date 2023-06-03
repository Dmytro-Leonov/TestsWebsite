from tests_website.tests.models import Test
from tests_website.users.models import User


def test_list_created_by_user(*, user: User):
    return Test.objects.filter(user=user).order_by("-created_at")
