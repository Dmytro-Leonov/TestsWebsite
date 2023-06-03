import datetime

from tests_website.tests.models import Test
from tests_website.questions.models import QuestionPool
from tests_website.users.models import User
from tests_website.groups.models import Group


def test_create(
    *,
    user: User,
    question_pool: QuestionPool,
    group: Group,
    name: str,
    description: str = "",
    time_limit: datetime.timedelta,
    start_date: datetime.datetime,
    end_date: datetime.datetime,
    attempts: int,
    score: int,
    shuffle_questions: bool = False,
    shuffle_answers: bool = False,
    show_score_after_test: bool = False,
    show_answers_after_test: bool = False,
    give_extra_time: bool = False,
):
    test = Test(
        user=user,
        question_pool=question_pool,
        group=group,
        name=name,
        description=description,
        time_limit=time_limit,
        start_date=start_date,
        end_date=end_date,
        attempts=attempts,
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
