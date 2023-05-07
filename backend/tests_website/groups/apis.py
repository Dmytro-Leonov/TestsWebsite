from django.core.exceptions import ValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import status

from tests_website.groups.models import Group
from tests_website.groups.utils import validate_max_groups_per_user, validate_max_users_in_a_group
from tests_website.api.mixins import ApiAuthMixin
from tests_website.groups.services import group_create, group_update, group_delete, group_add_members
from tests_website.groups.selectors import group_get, group_list_created_by_user, group_list_for_user_as_a_member


class GroupCreateApi(ApiAuthMixin, APIView):
    class InputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Group
            fields = ["name"]

    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        name = serializers.CharField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.request.user
        validate_max_groups_per_user(user=user)

        group = group_create(user=user, **serializer.validated_data)

        serializer = self.OutputSerializer(group)

        return Response(serializer.data, status.HTTP_201_CREATED)


class GroupDetailsApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        name = serializers.CharField()

    def get(self, request, group_id):
        user = self.request.user
        group = group_get(id=group_id, user=user)
        serializer = self.OutputSerializer(group)

        return Response(serializer.data, status.HTTP_200_OK)


class GroupUpdateApi(ApiAuthMixin, APIView):
    class InputSerializer(serializers.Serializer):
        name = serializers.CharField()

    class OutputSerializer(serializers.ModelSerializer):
        id = serializers.IntegerField()
        name = serializers.CharField()

    def patch(self, request, group_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.request.user
        group = group_get(id=group_id, user=user)

        group, _ = group_update(group=group, data=serializer.validated_data)

        serializer = self.OutputSerializer(group)

        return Response(serializer.data, status.HTTP_200_OK)


class GroupDeleteApi(ApiAuthMixin, APIView):
    def delete(self, request, group_id):
        user = self.request.user
        group = group_get(id=group_id, user=user)

        group_delete(group=group)

        return Response(status=status.HTTP_204_NO_CONTENT)


class GroupListCreatedByUserApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        name = serializers.CharField()
        members_count = serializers.IntegerField()
        created_at = serializers.DateTimeField()

    def get(self, request):
        user = self.request.user
        groups = group_list_created_by_user(user=user)
        serializer = self.OutputSerializer(groups, many=True)

        return Response(serializer.data, status.HTTP_200_OK)


class GroupListForUserAsAMemberApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        name = serializers.CharField()
        members_count = serializers.IntegerField()

    def get(self, request):
        user = self.request.user
        groups = group_list_for_user_as_a_member(user=user)
        serializer = self.OutputSerializer(groups, many=True)

        return Response(serializer.data, status.HTTP_200_OK)


class GroupAddMembersApi(ApiAuthMixin, APIView):
    class InputSerializer(serializers.Serializer):
        emails = serializers.ListField(child=serializers.EmailField())

    def post(self, request, group_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.request.user
        group = group_get(id=group_id, user=user)
        emails = serializer.validated_data["emails"]

        available_groups_to_create = validate_max_users_in_a_group(user=user, group=group)
        if available_groups_to_create < len(emails):
            raise ValidationError(f"You can only add {available_groups_to_create} more user(s) to this group")

        group_add_members(group=group, emails=emails)

        return Response(status=status.HTTP_204_NO_CONTENT)
