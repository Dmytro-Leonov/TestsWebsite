from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Count, F, Subquery, OuterRef, IntegerField, Q, Exists, Max, Sum, Min, Avg, \
    ExpressionWrapper, FloatField, Prefetch
from django.db.models.functions import Coalesce
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

from tests_website.questions.models import Question, Answer
from tests_website.common.utils import get_now
from tests_website.tests.models import Test, Log, Attempt, AttemptQuestion, AttemptAnswer
from tests_website.users.models import User


def test_list_created_by_user(*, user: User):
    return Test.objects.filter(user=user).order_by("-created_at")


def test_list_to_complete(*, user: User):
    tests = (
        Test
        .objects
        .filter(group__in=user.member_of_groups.all())
        .annotate(
            used_attempts=Count("attempts_set", filter=Q(attempts_set__user_id=user.id)),
            in_progress=Exists(
                Attempt.objects.filter(
                    test=OuterRef("id"),
                    user=user,
                    end_date__gt=get_now()
                )
            )
        )
        .order_by("-created_at")
    )

    return tests


def test_get_preview(*, user: User, test_id: int):
    test = (
        Test
        .objects
        .filter(id=test_id, group__in=user.member_of_groups.all())
        .annotate(
            used_attempts=Count("attempts_set", filter=Q(attempts_set__user_id=user.id)),
            in_progress=Exists(
                Attempt.objects.filter(
                    test=OuterRef("id"),
                    user=user,
                    end_date__gt=get_now()
                )
            ),
            last_attempt_id=Max("attempts_set__id"),
        )
        .first()
    )

    return test


def attempt_question_list(*, user: User, attempt: Attempt):
    attempt_questions = (
        AttemptQuestion
        .objects
        .filter(attempt_id=attempt, attempt__user=user)
        .order_by("order")
    )
    return attempt_questions


@transaction.atomic
def attempt_question_get(*, user: User, attempt_id: int, question_number: int):
    # check if user is in a group that is assigned to the test
    attempt = get_object_or_404(Attempt, id=attempt_id)

    # check if this is the user's attempt
    if attempt.user.id != user.id:
        raise ValidationError("This is not your attempt")

    if not attempt.test.group.members.filter(id=attempt.user.id).exists():
        raise ValidationError("You are not assigned to the test")

    # check if attempt is still active
    if attempt.end_date < get_now():
        raise ValidationError("Test attempt has ended")

    # check if test has ended
    if attempt.test.end_date < get_now():
        raise ValidationError("Test has already ended")

    attempt_question = (
        AttemptQuestion
        .objects
        .annotate(
            question_html=F("question__question"),
            question_type=F("question__type"),
        )
        .filter(attempt=attempt, order=question_number)
        .first()
    )

    if not attempt_question:
        raise ValidationError("Question does not exist")

    answers = (
        AttemptAnswer
        .objects
        .filter(attempt_question_id=attempt_question.id)
        .annotate(
            answer_html=F("answer__answer"),
        )
        .order_by("order")
    )

    Log.objects.create(
        attempt=attempt,
        question=attempt_question.question,
        action=Log.LogAction.ENTERED_QUESTION,
    )

    return attempt_question, answers


def attempt_test_details(*, user: User, attempt_id: int):
    attempt = get_object_or_404(Attempt, id=attempt_id)

    # check if this is the user's attempt
    if attempt.user.id != user.id:
        raise PermissionDenied("Error")

    if not attempt.test.group.members.filter(id=attempt.user.id).exists():
        raise PermissionDenied("Error")

    # check if attempt is still active
    if attempt.end_date < get_now():
        raise PermissionDenied("Test attempt has ended")

    # check if test has ended
    if attempt.test.end_date < get_now():
        raise PermissionDenied("Test has already ended")

    return attempt


def get_user_attempts(*, user: User, test_id: int):
    attempts = (
        Attempt
        .objects
        .filter(user=user, test_id=test_id, end_date__lt=get_now())
        .annotate(
            score=Sum("attemptquestion__points") / Count("attemptquestion") * F("test__score")
        )
        .order_by("start_date")
    )

    return attempts


def test_stats(*, user: User, test_id: int):

    now = get_now()

    test_qs = (
        Test
        .objects
        .filter(
            attempts_set__end_date__lt=now
        )
        .annotate(
            total_questions_answered=Count(
                "attempts_set__attemptquestion",
            ),
            correctly_answered_questions=Count(
                "attempts_set__attemptquestion",
                filter=Q(
                    attempts_set__attemptquestion__has_answer=True,
                    attempts_set__attemptquestion__points__gt=0,
                )
            ),
            incorrectly_answered_questions=Count(
                "attempts_set__attemptquestion",
                filter=Q(
                    attempts_set__attemptquestion__has_answer=True,
                    attempts_set__attemptquestion__points__lt=1,
                )
            ),
            not_answered_questions=Count(
                "attempts_set__attemptquestion",
                filter=Q(
                    attempts_set__attemptquestion__has_answer=False,
                )
            ),
        )
    )

    test = test_qs.filter(id=test_id).first()

    if not test:
        raise ValidationError("No stats available")

    if test.user != user:
        raise PermissionDenied("You are not the father")

    attempts = (
        Attempt
        .objects
        .filter(test_id=test_id, end_date__lt=now)
        .annotate(
            score=ExpressionWrapper(
                Sum("attemptquestion__points") / Count("attemptquestion") * F("test__score"),
                output_field=FloatField(),
            ),
        )
        .aggregate(
            max_score=Max("score"),
            min_score=Min("score"),
            avg_score=Avg("score"),
            max_time_taken=Max(F("end_date") - F("start_date")),
            min_time_taken=Min(F("end_date") - F("start_date")),
            avg_time_taken=Avg(F("end_date") - F("start_date")),
        )
    )

    questions = (
        Question
        .objects
        .filter(tests=test_id)
        .annotate(
            correctly_answered=Count(
                "attemptquestion",
                filter=Q(
                    attemptquestion__attempt__test_id=test_id,
                    attemptquestion__attempt__end_date__lt=now,
                    attemptquestion__points__gt=0,
                )
            ),
            incorrectly_answered=Count(
                "attemptquestion",
                filter=Q(
                    attemptquestion__attempt__test_id=test_id,
                    attemptquestion__attempt__end_date__lt=now,
                    attemptquestion__has_answer=True,
                    attemptquestion__points__lt=1,
                )
            ),
            not_answered=Count(
                "attemptquestion",
                filter=Q(
                    attemptquestion__attempt__test_id=test_id,
                    attemptquestion__attempt__end_date__lt=now,
                    attemptquestion__has_answer=False,
                )
            )
        )
        .prefetch_related(
            Prefetch(
                "answers",
                queryset=Answer.objects.annotate(
                    chosen=Count(
                        "attemptanswer",
                        filter=Q(
                            attemptanswer__attempt_question__attempt__test_id=test_id,
                            attemptanswer__attempt_question__attempt__end_date__lt=now,
                            attemptanswer__is_selected=True,
                        )
                    )
                )
            )
        )
    )
    # print(questions)
    # print(questions[0].answers.all(), questions[1].answers.all())
    # print(questions[0].answers.all()[0].chosen, questions[0].answers.all()[1].chosen, questions[0].answers.all()[2].chosen)
    # print(questions[1].answers.all()[0].chosen, questions[1].answers.all()[1].chosen)

    # print(questions[0])

    # example = [
    #     {
    #         "question": "adsf",
    #         "correctly_answered": 10,
    #         "incorrectly_answered": 20,
    #         "not_answered": 30,
    #         "answers": [
    #             {
    #                 "answer": "asdf",
    #                 "chosen": 10,
    #             },
    #             {
    #                 "answer": "asdf",
    #                 "chosen": 5,
    #             },
    #         ]
    #     },
    #     {
    #         "question": "adsf",
    #         "correctly_answered": 10,
    #         "incorrectly_answered": 20,
    #         "not_answered": 30,
    #         "answers": [
    #             {
    #                 "answer": "asdf",
    #                 "chosen": 10,
    #             },
    #             {
    #                 "answer": "asdf",
    #                 "chosen": 5,
    #             },
    #         ]
    #     }
    # ]

    return test, attempts, questions
