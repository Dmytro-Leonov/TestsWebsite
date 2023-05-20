from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models import Count

from tests_website.common.utils import get_object
from tests_website.groups.models import Group, GroupMember
from tests_website.users.models import User


def group_get(**kwargs) -> Group:
    group = get_object(Group, **kwargs)

    if not group:
        raise ObjectDoesNotExist("Group does not exist")

    return group


def group_details(*, group_id: int, user_id: int):
    group = (
        Group
        .objects
        .filter(id=group_id)
        .annotate(
            is_owner=models.Case(
                models.When(user_id=user_id, then=True),
                default=False,
                output_field=models.BooleanField(),
            ),
            is_member=models.Exists(
                GroupMember.objects.filter(group_id=group_id, user_id=user_id)
            ),
        )
        .prefetch_related("members")
        .first()
    )

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


def group_member_get(*, group_id: int, user_id: int):
    group_member = GroupMember.objects.get(group_id=group_id, user_id=user_id)

    return group_member
