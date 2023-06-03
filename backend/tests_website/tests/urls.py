from django.urls import path

from tests_website.tests.apis import TestCreateApi, TestDetailsApi, TestListCreatedByUserApi

urlpatterns = [
    path("create/", TestCreateApi.as_view(), name="create-test"),
    path("<int:test_id>/", TestDetailsApi.as_view(), name="test-details"),
    path("list-created/", TestListCreatedByUserApi.as_view(), name="test-list-created"),
]
