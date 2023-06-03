from django.db.models import QuerySet
from django.shortcuts import get_object_or_404

from tests_website.questions.models import QuestionPool
from tests_website.users.models import User


def question_pools_list(user: User) -> QuerySet[QuestionPool]:
    return QuestionPool.objects.filter(user=user)


def question_pool_details(question_pool_id: int) -> QuestionPool:
    question_pool = get_object_or_404(QuestionPool, id=question_pool_id)
    return question_pool
