import datetime

from django.core.exceptions import ValidationError
from django.db import transaction

from tests_website.tests.models import Test, TestQuestion
from tests_website.questions.models import QuestionPool, Question
from tests_website.users.models import User
from tests_website.groups.models import Group


@transaction.atomic
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
    if question_pool.questions.count() == 0:
        raise ValidationError({"question_pool": "Question pool must contain at least one question"})

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

    questions = question_pool.questions.all().prefetch_related("answers")

    # duplicate all questions with their answers for the test
    for question in questions:
        answers = question.answers.all()

        question_copy = question
        question_copy.id = None
        question.question_pool = None
        question_copy.save()

        for answer in answers:
            answer_copy = answer

            answer_copy.id = None
            answer_copy.question = question_copy
            answer_copy.save()

            question_copy.answers.add(answer_copy)

        TestQuestion.objects.create(test=test, question=question_copy, order=question.order)

    return test


@transaction.atomic
def test_delete(*, test: Test):
    print(test)
    Question.objects.filter(testquestion__test_id=test.id).delete()
    test.delete()

