from django.urls import path

from tests_website.users.apis import (
    UserListApi,
    UserUpdateApi,
)

urlpatterns = [
    path("", UserListApi.as_view(), name="list"),
    path("update/", UserUpdateApi.as_view(), name="update"),
]
