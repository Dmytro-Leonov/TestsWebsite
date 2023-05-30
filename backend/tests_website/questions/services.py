from django.db import transaction

from tests_website.questions.models import Question, QuestionPool, Answer
from tests_website.users.models import User

from tests_website.common.services import model_update

from typing import Optional


@transaction.atomic
def question_create(
    *,
    user: User,
    original_question: Optional[Question] = None,
    question_pool: QuestionPool | None,
    question: str,
    type: str,
    order: int,
    is_original: bool = True,
    answers: list[dict[str, str | bool | int]],
):
    question = Question(
        user=user,
        original_question=original_question,
        question_pool=question_pool,
        question=question,
        type=type,
        order=order,
        is_original=is_original,
    )
    question.full_clean()
    question.save()

    for answer in answers:
        answer = Answer(question=question, **answer)
        answer.full_clean()
        answer.save()

    return question


def question_pool_create(*, name: str, user: User) -> QuestionPool:
    question_pool = QuestionPool(name=name, user=user)
    question_pool.full_clean()
    question_pool.save()

    return question_pool


def question_pool_update(*, question_pool: QuestionPool, name: str) -> QuestionPool:
    question_pool, _ = model_update(instance=question_pool, fields=["name"], data={"name": name})

    return question_pool
