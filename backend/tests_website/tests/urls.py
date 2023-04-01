from django.urls import path

from tests_website.tests.apis import TestCreateApi

urlpatterns = [
    path("create/", TestCreateApi.as_view(), name="create-test")
]
