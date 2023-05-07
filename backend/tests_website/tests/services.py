import datetime

from tests_website.tests.models import Test
from tests_website.users.models import User


def test_create(
    *,
    user: User,
    name: str,
    description: str = "",
    time_limit: datetime.timedelta,
    attempts: int,
    number_of_questions: int,
    score: int,
    shuffle_questions: bool = False,
    shuffle_answers: bool = False,
    show_score_after_test: bool = False,
    show_answers_after_test: bool = False,
    give_extra_time: bool = False,
):
    test = Test(
        user=user,
        name=name,
        description=description,
        time_limit=time_limit,
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
