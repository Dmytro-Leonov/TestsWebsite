from django.db.models import Count, F, Subquery, OuterRef, IntegerField, Q, Exists

from tests_website.common.utils import get_now
from tests_website.tests.models import Test, Attempt
from tests_website.users.models import User


def test_list_created_by_user(*, user: User):
    return Test.objects.filter(user=user).order_by("-created_at")


def test_list_to_complete(*, user: User):
    tests = (
        Test
        .objects
        .filter(group__in=user.member_of_groups.all())
        .annotate(
            used_attempts=Count("attempts_set", filter=Q(attempts_set__user_id=user.id)),
            in_progress=Exists(
                Attempt.objects.filter(
                    test=OuterRef("id"),
                    user=user,
                    end_date__gt=get_now()
                )
            )
        )
        .order_by("-created_at")
    )

    return tests
