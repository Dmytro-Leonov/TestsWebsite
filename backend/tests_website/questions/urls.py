from django.urls import path

from tests_website.questions.apis import (
    QuestionCreateApi,
    QuestionPoolCreateApi,
    QuestionPoolListApi,
    QuestionPoolDetailApi,
    QuestionPoolUpdateApi,
    QuestionPoolDeleteApi,
    QuestionDeleteApi,
    QuestionUpdateOrderApi,
)

urlpatterns = [
    path("question/create/", QuestionCreateApi.as_view()),
    path("question/<int:question_id>/delete/", QuestionDeleteApi.as_view()),
    path("question/<int:question_id>/update-order/", QuestionUpdateOrderApi.as_view()),
    path("question-pool/create/", QuestionPoolCreateApi.as_view()),
    path("question-pool/list/", QuestionPoolListApi.as_view()),
    path("question-pool/<int:question_pool_id>/", QuestionPoolDetailApi.as_view()),
    path("question-pool/<int:question_pool_id>/update/", QuestionPoolUpdateApi.as_view()),
    path("question-pool/<int:question_pool_id>/delete/", QuestionPoolDeleteApi.as_view()),
]
