from django.core.exceptions import ValidationError

from tests_website.users.models import User
from tests_website.groups.models import Group

from tests_website.common.services import model_update


def group_create(*, user: User, name: str):
    subscription = user.subscription

    if subscription.max_groups <= user.created_groups.count():
        raise ValidationError(
            f"You have reached the maximum number of groups ({subscription.max_groups}) for your subscription"
        )

    group = Group(user=user, name=name)
    group.full_clean()
    group.save()

    return group


def group_update(*, group: Group, data):
    group, has_updated = model_update(instance=group, fields=["name"], data=data)
    return group, has_updated


def group_delete(*, group: Group):
    group.delete()
