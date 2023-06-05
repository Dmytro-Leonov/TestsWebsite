from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Count, F, Subquery, OuterRef, IntegerField, Q, Exists, Max
from django.shortcuts import get_object_or_404

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
        # .annotate(
        #     question=F("question__question"),
        #     question_type=F("question__question_type"),
        # )
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
        .get(attempt=attempt, order=question_number)

    )

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
        user=user,
        attempt=attempt,
        question=attempt_question.question,
        action=Log.LogAction.ENTERED_QUESTION,
    )

    return attempt_question, answers
