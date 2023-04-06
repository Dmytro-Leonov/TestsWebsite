from tests_website.subscriptions.models import Subscription


def subscription_create(
    name: str,
    price: float,
    description: str,
    max_question_pools: int,
    max_questions_total: int,
    max_questions_in_a_test: int,
    max_tests: int,
    max_groups: int,
    max_users_in_a_group: int,
    max_answers_to_a_question: int,
    can_see_logs: bool,
    can_see_statistics: bool,
    is_default: bool,
) -> Subscription:
    subscription = Subscription(
        name=name,
        price=price,
        description=description,
        max_question_pools=max_question_pools,
        max_questions_total=max_questions_total,
        max_questions_in_a_test=max_questions_in_a_test,
        max_tests=max_tests,
        max_groups=max_groups,
        max_users_in_a_group=max_users_in_a_group,
        max_answers_to_a_question=max_answers_to_a_question,
        can_see_logs=can_see_logs,
        can_see_statistics=can_see_statistics,
        is_default=is_default,
    )

    subscription.full_clean()
    subscription.save()

    return subscription


def subscription_create_default() -> Subscription:
    default_subscription = subscription_create(
        name="Free",
        price=0.0,
        description="Free tier",
        max_question_pools=5,
        max_questions_total=100,
        max_questions_in_a_test=20,
        max_tests=10,
        max_groups=5,
        max_users_in_a_group=30,
        max_answers_to_a_question=4,
        can_see_logs=False,
        can_see_statistics=False,
        is_default=True,
    )

    return default_subscription
