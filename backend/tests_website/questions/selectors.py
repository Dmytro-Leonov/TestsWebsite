from django.db.models import Count, QuerySet

from tests_website.questions.models import QuestionPool
from tests_website.users.models import User


def question_pools_list(user: User) -> QuerySet[QuestionPool]:
    return QuestionPool.objects.filter(user=user).annotate(questions_count=Count("questions"))
