from django.core.exceptions import ValidationError

from tests_website.users.models import User
from tests_website.groups.models import Group


def validate_max_groups_per_user(user: User) -> int:
    subscription = user.subscription
    max_groups = subscription.max_groups
    created_groups = user.created_groups.count()

    if max_groups <= created_groups:
        raise ValidationError(
            f"You have reached the maximum number of groups ({max_groups})"
        )

    return max_groups - created_groups


def validate_max_users_in_a_group(user: User, group: Group) -> int:
    subscription = user.subscription
    max_users_in_a_group = subscription.max_users_in_a_group
    members = group.members.count()

    if max_users_in_a_group <= members:
        raise ValidationError(
            f"You have reached the maximum number of users in a group ({max_users_in_a_group}) for your subscription"
        )

    return max_users_in_a_group - members
