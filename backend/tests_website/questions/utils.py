from django.core.exceptions import ValidationError

from tests_website.users.models import User


def validate_max_question_pools(user: User):
    user_question_pools = user.question_pools.count()
    user_allowed_question_pools = user.subscription.max_question_pools

    if user_question_pools >= user_allowed_question_pools:
        raise ValidationError(
            f"You have reached the maximum number of question pools ({user_allowed_question_pools})"
        )
