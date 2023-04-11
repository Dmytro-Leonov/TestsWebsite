from django.core.exceptions import  PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import status

from tests_website.api.mixins import ApiAuthMixin
from tests_website.groups.services import group_create, group_update, group_delete
from tests_website.groups.selectors import group_get, group_list_created_by_user, group_list_for_user_as_a_member


class GroupCreateApi(APIView, ApiAuthMixin):
    class InputSerializer(serializers.Serializer):
        name = serializers.CharField()

    class OutputSerializer(serializers.ModelSerializer):
        id = serializers.IntegerField()
        name = serializers.CharField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.request.user
        group = group_create(user=user, **serializer.validated_data)

        serializer = self.OutputSerializer(group)

        return Response(serializer.data, status.HTTP_201_CREATED)


class GroupDetailsApi(APIView, ApiAuthMixin):
    class OutputSerializer(serializers.ModelSerializer):
        id = serializers.IntegerField()
        name = serializers.CharField()

    def get(self, request, group_id):
        user = self.request.user
        group = group_get(id=group_id, user=user)
        serializer = self.OutputSerializer(group)

        return Response(serializer.data, status.HTTP_200_OK)


class GroupUpdateApi(APIView, ApiAuthMixin):
    class InputSerializer(serializers.Serializer):
        name = serializers.CharField()

    class OutputSerializer(serializers.ModelSerializer):
        id = serializers.IntegerField()
        name = serializers.CharField()

    def put(self, request, group_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self.request.user
        group = group_get(id=group_id, user=user)

        if group.user != user:
            raise PermissionDenied("You can only update groups you have created")

        group, _ = group_update(group=group, data=serializer.validated_data)

        serializer = self.OutputSerializer(group)

        return Response(serializer.data, status.HTTP_200_OK)


class GroupDeleteApi(APIView, ApiAuthMixin):
    def delete(self, request, group_id):
        user = self.request.user
        group = group_get(id=group_id, user=user)

        if group.user != user:
            raise PermissionDenied("You can only delete groups you have created")

        group_delete(group=group)

        return Response(status=status.HTTP_204_NO_CONTENT)


class GroupListCreatedByUserApi(APIView, ApiAuthMixin):
    class OutputSerializer(serializers.ModelSerializer):
        id = serializers.IntegerField()
        name = serializers.CharField()

    def get(self, request):
        user = self.request.user
        groups = group_list_created_by_user(user=user)
        serializer = self.OutputSerializer(groups, many=True)

        return Response(serializer.data, status.HTTP_200_OK)


class GroupListForUserAsAMemberApi(APIView, ApiAuthMixin):
    class OutputSerializer(serializers.ModelSerializer):
        id = serializers.IntegerField()
        name = serializers.CharField()
        created_at = serializers.DateTimeField()

    def get(self, request):
        user = self.request.user
        groups = group_list_for_user_as_a_member(user=user)
        serializer = self.OutputSerializer(groups, many=True)

        return Response(serializer.data, status.HTTP_200_OK)
