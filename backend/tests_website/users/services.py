from typing import Optional, Tuple

from django.db import transaction

from tests_website.common.services import model_update
from tests_website.users.models import User


def user_create(
    *,
    full_name: str,
    email: str,
    is_active: bool = True,
    is_admin: bool = False,
    password: Optional[str] = None,
    **other_fields,
) -> User:
    user = User.objects.create_user(
        full_name=full_name, email=email, is_active=is_active, is_admin=is_admin, password=password, **other_fields
    )

    return user


@transaction.atomic
def user_update(*, user: User, data) -> User:
    non_side_effect_fields = ["full_name", "subscription", "is_active", "is_admin"]

    user, has_updated = model_update(instance=user, fields=non_side_effect_fields, data=data)

    return user


@transaction.atomic
def user_get_or_create(*, email: str, **extra_data) -> Tuple[User, bool]:
    user = User.objects.filter(email=email).first()

    if user:
        return user, False

    return user_create(email=email, **extra_data), True
