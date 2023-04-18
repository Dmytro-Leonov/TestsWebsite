from tests_website.users.models import User
from tests_website.groups.models import Group, GroupMember


from tests_website.common.services import model_update


def group_create(*, user: User, name: str):
    group = Group(user=user, name=name)
    group.full_clean()
    group.save()

    return group


def group_update(*, group: Group, data):
    group, has_updated = model_update(instance=group, fields=["name"], data=data)

    return group, has_updated


def group_delete(*, group: Group):
    group.delete()


def group_add_members(*, group: Group, emails: list[str]):
    emails = set(emails)
    user_emails_in_a_group = set(group.members.values_list("email", flat=True))
    user_emails_to_add = emails - user_emails_in_a_group

    users = User.objects.filter(email__in=user_emails_to_add)

    added_members = GroupMember.objects.bulk_create(
        [GroupMember(group=group, user=user) for user in users],
    )

    return added_members
