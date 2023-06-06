from django.urls import path

from tests_website.tests.apis import (
    TestCreateApi,
    TestDetailsApi,
    TestListCreatedByUserApi,
    TestDeleteApi,
    TestUpdateApi,
    TestListToCompleteApi,
    TestGetPreviewApi,
    TestStartApi,
    TestAttemptAllQuestionsList,
    TestAttemptGetQuestion,
    AttemptAnswerSelect,
    AttemptQuestionMarkAsAnswered,
    AttemptTestDetails,
    AttemptFinish,
    TestStatsApi,
)

urlpatterns = [
    path("create/", TestCreateApi.as_view(), name="create-test"),
    path("<int:test_id>/", TestDetailsApi.as_view(), name="test-details"),
    path("<int:test_id>/delete/", TestDeleteApi.as_view(), name="test-delete"),
    path("list-created/", TestListCreatedByUserApi.as_view(), name="test-list-created"),
    path("<int:test_id>/update/", TestUpdateApi.as_view(), name="test-update"),
    path("list-to-complete/", TestListToCompleteApi.as_view(), name="test-list-to-complete"),
    path("<int:test_id>/preview/", TestGetPreviewApi.as_view(), name="test-get-preview"),
    path("<int:test_id>/start/", TestStartApi.as_view(), name="test-start"),
    path("attempt/<int:attempt_id>/all-questions/", TestAttemptAllQuestionsList.as_view(), name="test-attempt-all-questions-list"),
    path("attempt/<int:attempt_id>/question/<int:question_number>/", TestAttemptGetQuestion.as_view(), name="test-attempt-get-question"),
    path("attempt/select-answer/<int:attempt_answer_id>/", AttemptAnswerSelect.as_view(), name="attempt-answer-select"),
    path("attempt/mark-as-answered/<int:attempt_question_id>/", AttemptQuestionMarkAsAnswered.as_view(), name="attempt-question-mark-as-answered"),
    path("attempt/<int:attempt_id>/details/", AttemptTestDetails.as_view(), name="attempt-test-details"),
    path("attempt/<int:attempt_id>/finish/", AttemptFinish.as_view(), name="attempt-finish"),
    path("<int:test_id>/stats/", TestStatsApi.as_view(), name="test-stats"),
]
