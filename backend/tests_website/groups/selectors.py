from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count

from tests_website.common.utils import get_object
from tests_website.groups.models import Group
from tests_website.users.models import User


def group_get(**kwargs):
    group = get_object(Group, **kwargs)

    if not group:
        raise ObjectDoesNotExist("Group does not exist")

    return group


def group_list_created_by_user(*, user: User):
    groups = (
        Group
        .objects
        .annotate(members_count=Count("members"))
        .filter(user=user)
        .order_by("name")
    )
    return groups


def group_list_for_user_as_a_member(*, user: User):
    groups = (
        Group
        .objects
        .annotate(members_count=Count("members"))
        .filter(members=user)
        .order_by("name")
    )
    return groups
