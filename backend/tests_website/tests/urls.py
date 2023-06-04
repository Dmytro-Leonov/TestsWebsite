from django.urls import path

from tests_website.tests.apis import (
    TestCreateApi,
    TestDetailsApi,
    TestListCreatedByUserApi,
    TestDeleteApi,
    TestUpdateApi,
    TestListToCompleteApi,
)

urlpatterns = [
    path("create/", TestCreateApi.as_view(), name="create-test"),
    path("<int:test_id>/", TestDetailsApi.as_view(), name="test-details"),
    path("<int:test_id>/delete/", TestDeleteApi.as_view(), name="test-delete"),
    path("list-created/", TestListCreatedByUserApi.as_view(), name="test-list-created"),
    path("<int:test_id>/update/", TestUpdateApi.as_view(), name="test-update"),
    path("list-to-complete/", TestListToCompleteApi.as_view(), name="test-list-to-complete"),
]
