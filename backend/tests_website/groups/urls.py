from django.urls import path

from tests_website.groups.apis import (
    GroupCreateApi,
    GroupDetailsApi,
    GroupUpdateApi,
    GroupDeleteApi,
    GroupListCreatedByUserApi,
    GroupListForUserAsAMemberApi,
    GroupAddMembersApi,
)

urlpatterns = [
    path("create/", GroupCreateApi.as_view(), name="group-create"),
    path("details/<int:group_id>/", GroupDetailsApi.as_view(), name="group-details"),
    path("update/<int:group_id>/", GroupUpdateApi.as_view(), name="group-update"),
    path("delete/<int:group_id>/", GroupDeleteApi.as_view(), name="group-delete"),
    path("list-created-by-user/", GroupListCreatedByUserApi.as_view(), name="list-groups-created-by-user"),
    path("list-for-user-as-a-member/", GroupListForUserAsAMemberApi.as_view(), name="list-groups-for-user-as-a-member"),
    path("add-members/<int:group_id>/", GroupAddMembersApi.as_view(), name="group-add-members"),
]
