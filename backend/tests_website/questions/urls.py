from django.urls import path

from tests_website.questions.apis import (
    QuestionCreateApi,
    QuestionPoolCreateApi,
    QuestionPoolListApi
)

urlpatterns = [
    path("question/create/", QuestionCreateApi.as_view()),
    path("question-pool/create/", QuestionPoolCreateApi.as_view()),
    path("question-pool/list/", QuestionPoolListApi.as_view()),
]
