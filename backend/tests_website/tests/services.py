from django.core.exceptions import ValidationError

from tests_website.common.utils import get_object
from tests_website.tests.models import Test
from tests_website.users.models import User


def test_create(
    *,
    user: User,
    name: str,
    description: str = "",
    time_limit_seconds: int,
    attempts: int,
    number_of_questions: int,
    score: int,
    shuffle_questions: bool = False,
    shuffle_answers: bool = False,
    show_score_after_test: bool = False,
    show_answers_after_test: bool = False,
    give_extra_time: bool = False,
):
    if get_object(Test, user=user, name=name):
        raise ValidationError({"name": "You have already created test with this name"})

    test = Test.objects.create(
        user=user,
        name=name,
        description=description,
        time_limit_seconds=time_limit_seconds,
        attempts=attempts,
        number_of_questions=number_of_questions,
        score=score,
        shuffle_questions=shuffle_questions,
        shuffle_answers=shuffle_answers,
        show_score_after_test=show_score_after_test,
        show_answers_after_test=show_answers_after_test,
        give_extra_time=give_extra_time,
    )

    test.full_clean()
    test.save()

    return test
