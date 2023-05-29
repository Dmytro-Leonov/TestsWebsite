from tests_website.questions.models import Question, QuestionPool
from tests_website.users.models import User

from tests_website.common.services import model_update


# def question_create(
#     *,
#     original_question: Question | None,
#     question_pool: int | None,
#     question: str,
#     type: str,
#     is_original: bool = True,
# ):
#     question =

def question_pool_create(*, name: str, user: User) -> QuestionPool:
    question_pool = QuestionPool(name=name, user=user)
    question_pool.full_clean()
    question_pool.save()

    return question_pool


def question_pool_update(*, question_pool: QuestionPool, name: str) -> QuestionPool:
    question_pool, _ = model_update(instance=question_pool, fields=["name"], data={"name": name})

    return question_pool
