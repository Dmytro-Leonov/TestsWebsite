import datetime
import random

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Q, F
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

from tests_website.common.services import model_update
from tests_website.common.utils import get_now
from tests_website.tests.models import Test, Log, TestQuestion, Attempt, AttemptAnswer, AttemptQuestion
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

    subscription = user.subscription
    # check if user had already created a max number of tests
    if Test.objects.filter(user=user).count() >= subscription.max_tests:
        raise ValidationError("You have reached the maximum number of tests you can create")

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
    Question.objects.filter(testquestion__test_id=test.id).delete()
    test.delete()


def test_update(*, test: Test, data):
    fields = ["name", "description", "time_limit", "start_date", "end_date", "attempts", "score",
              "shuffle_questions", "shuffle_answers", "show_score_after_test", "show_answers_after_test",
              "give_extra_time"]

    # check if test has started and if so, do not allow to change
    # start_date, end_date, attempts, score, time_limit, give_extra_time, shuffle_questions, shuffle_answers
    if test.start_date < get_now():
        fields = [field for field in fields if field not in
                  ["start_date", "end_date", "attempts", "time_limit", "give_extra_time",
                   "shuffle_questions", "shuffle_answers"]]

    test, _ = model_update(instance=test, fields=fields, data=data)

    return test


@transaction.atomic
def test_start(*, user: Test, test: Test):
    # check if user is in a group that is assigned to the test
    if not test.group.members.filter(id=user.id).exists():
        raise ValidationError("You are not assigned to the test")

    # check if test has started
    if test.start_date > get_now():
        raise ValidationError("Test has not started yet")

    # check if test has ended
    if test.end_date < get_now():
        raise ValidationError("Test has already ended")

    # check if user has available attempts
    if test.attempts <= Attempt.objects.filter(user=user, test=test).count():
        raise ValidationError("You have no available attempts")

    # check if user has already started the test
    if Attempt.objects.filter(user=user, test=test, end_date__gte=get_now()).exists():
        raise ValidationError("You have already started this test")

    # create attempt
    attempt = Attempt.objects.create(
        user=user,
        test=test,
        start_date=get_now(),
        end_date=min(get_now() + test.time_limit, test.end_date)
    )

    # create attempt questions and attempt answers
    test_questions = TestQuestion.objects.filter(test=test).prefetch_related("question__answers")

    # shuffle questions if needed
    if test.shuffle_questions:
        test_questions = list(test_questions)
        random.shuffle(test_questions)

    for i, test_question in enumerate(test_questions):
        attempt_question = AttemptQuestion.objects.create(
            attempt=attempt,
            question=test_question.question,
            order=i + 1
        )
        answers = test_question.question.answers.all()

        # shuffle answers if needed
        if test.shuffle_answers:
            answers = list(answers)
            random.shuffle(answers)

        for order, answer in enumerate(answers):
            AttemptAnswer.objects.create(attempt_question=attempt_question, answer=answer, order=order + 1)

    return attempt.id


def attempt_answer_select(*, user: User, attempt_answer_id: int, selected: bool):
    attempt_answer = get_object_or_404(AttemptAnswer, id=attempt_answer_id)

    # check if attempt is not finished
    if attempt_answer.attempt_question.attempt.end_date < get_now():
        raise ValidationError("Attempt is finished")

    # check if user is the owner of the attempt
    if attempt_answer.attempt_question.attempt.user_id != user.id:
        raise ValidationError("Error")

    question = attempt_answer.attempt_question.question

    # check question type
    if question.type == Question.QuestionType.SINGLE_CHOICE:
        # unselect all other answers
        AttemptAnswer.objects.filter(
            attempt_question=attempt_answer.attempt_question
        ).update(is_selected=False)

        attempt_answer.is_selected = True
        attempt_answer.attempt_question.has_answer = True

        if attempt_answer.answer.is_correct:
            attempt_answer.is_correct = True
            attempt_answer.attempt_question.points = 1
        else:
            attempt_answer.is_correct = False
            attempt_answer.attempt_question.points = 0

        attempt_answer.attempt_question.save()
        attempt_answer.save()
    elif question.type == Question.QuestionType.MULTIPLE_CHOICE:
        attempt_answer.is_selected = selected
        attempt_answer.save()

        # check if all other answers are selected correctly
        all_are_correct = not AttemptAnswer.objects.filter(
            Q(attempt_question=attempt_answer.attempt_question),
            ~Q(is_selected=F("answer__is_correct"))
        ).exists()

        if all_are_correct:
            attempt_answer.attempt_question.points = 1
        else:
            attempt_answer.attempt_question.points = 0

        attempt_answer.attempt_question.has_answer = AttemptAnswer.objects.filter(
            attempt_question=attempt_answer.attempt_question,
            is_selected=True
        ).exists()

        attempt_answer.attempt_question.save()

    return attempt_answer.attempt_question.attempt_id, attempt_answer.answer_id


def record_answer_select(*, attempt_id: int, answer_id: int, selected: bool):
    action = Log.LogAction.SELECTED_ANSWER if selected else Log.LogAction.DESELECTED_ANSWER

    Log.objects.create(
        attempt_id=attempt_id,
        answer_id=answer_id,
        action=action
    )


def attempt_question_mark_as_answered(*, attempt_question_id: int, answered: bool):
    attempt_question = get_object_or_404(AttemptQuestion, id=attempt_question_id)

    # check if attempt is not finished
    if attempt_question.attempt.end_date < get_now():
        raise ValidationError("Attempt is finished")

    attempt_question.marked_as_answered = answered
    attempt_question.save()


def record_question_mark_as_answered(*, attempt_question_id: int, answered: bool):
    attempt_question = get_object_or_404(AttemptQuestion, id=attempt_question_id)
    Log.objects.create(
        attempt_id=attempt_question.attempt_id,
        question_id=attempt_question.question_id,
        action=Log.LogAction.MARKED_AS_ANSWERED if answered else Log.LogAction.UNMARKED_AS_ANSWERED
    )


def attempt_finish(user: User, attempt_id: int):
    attempt = get_object_or_404(Attempt, id=attempt_id)

    # check if attempt is not finished
    if attempt.end_date < get_now():
        raise ValidationError("Attempt is finished")

    # check if user is the owner of the attempt
    if attempt.user_id != user.id:
        raise PermissionDenied()

    attempt.end_date = get_now()
    attempt.save()

