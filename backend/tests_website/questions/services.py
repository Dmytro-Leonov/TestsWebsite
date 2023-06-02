from django.db import transaction
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404

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
    subscription = user.subscription

    # check if the question pool belongs to the user
    if question_pool is not None and question_pool.user != user:
        raise ValidationError("You can not add questions to this question pool")

    # check if there is an appropriate number of correct answers for the question type
    if type == Question.QuestionType.SINGLE_CHOICE:
        number_of_correct_answers = sum(answer["is_correct"] for answer in answers)
        if number_of_correct_answers != 1:
            raise ValidationError("You must provide exactly one correct answer for this question type")
    elif type == Question.QuestionType.MULTIPLE_CHOICE:
        number_of_correct_answers = sum(answer["is_correct"] for answer in answers)
        if number_of_correct_answers < 1:
            raise ValidationError("You must provide at least one correct answer for this question type")

    # check if max number of questions is reached
    allowed_number_of_questions = subscription.max_questions_total
    user_questions_count = user.created_questions.count()

    if user_questions_count >= allowed_number_of_questions:
        raise ValidationError("You have reached the maximum number of questions")

    # check if max number of answers is reached
    allowed_number_of_answers = subscription.max_answers_to_a_question
    if len(answers) > allowed_number_of_answers:
        raise ValidationError(f"You are limited to a maximum number of answers ({allowed_number_of_answers}) for a question") # noqa

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


@transaction.atomic
def question_update(
    *,
    user: User,
    id: int,
    question: str,
    type: str,
    answers: list[dict[str, str | bool | int]],
):
    subscription = user.subscription
    question_obj = get_object_or_404(Question, id=id)

    # check if the question pool belongs to the user
    if question_obj.user != user:
        raise ValidationError("You can not edit this question")

    # check if there is an appropriate number of correct answers for the question type
    if type == Question.QuestionType.SINGLE_CHOICE:
        number_of_correct_answers = sum(answer["is_correct"] for answer in answers)
        if number_of_correct_answers != 1:
            raise ValidationError("You must provide exactly one correct answer for this question type")
    elif type == Question.QuestionType.MULTIPLE_CHOICE:
        number_of_correct_answers = sum(answer["is_correct"] for answer in answers)
        if number_of_correct_answers < 1:
            raise ValidationError("You must provide at least one correct answer for this question type")

    # check if max number of questions is reached
    allowed_number_of_questions = subscription.max_questions_total
    user_questions_count = user.created_questions.count()

    if user_questions_count >= allowed_number_of_questions:
        raise ValidationError("You have reached the maximum number of questions")

    # check if max number of answers is reached
    allowed_number_of_answers = subscription.max_answers_to_a_question
    if len(answers) > allowed_number_of_answers:
        raise ValidationError(f"You are limited to a maximum number of answers ({allowed_number_of_answers}) for a question") # noqa

    question_obj.question = question
    question_obj.type = type

    question_obj.full_clean()
    question_obj.save()

    question_obj.answers.all().delete()

    for answer in answers:
        answer = Answer(question=question_obj, **answer)
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


def question_details(*, question_id: int) -> Question:
    return get_object_or_404(Question.objects.prefetch_related("answers"), id=question_id)
