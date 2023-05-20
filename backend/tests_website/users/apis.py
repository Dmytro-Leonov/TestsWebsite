from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response

from tests_website.api.pagination import (
    LimitOffsetPagination,
    get_paginated_response,
)
from tests_website.api.mixins import ApiAuthMixin
from tests_website.users.models import User
from tests_website.users.selectors import user_list
from tests_website.users.services import user_update


class UserListApi(APIView):
    class Pagination(LimitOffsetPagination):
        default_limit = 1

    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        is_admin = serializers.BooleanField(required=False, allow_null=True, default=None)
        email = serializers.EmailField(required=False)
        full_name = serializers.CharField(required=False)

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ("id", "full_name", "email", "is_admin")

    def get(self, request):
        # Make sure the filters are valid, if passed
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        users = user_list(filters=filters_serializer.validated_data)

        return get_paginated_response(
            pagination_class=self.Pagination,
            serializer_class=self.OutputSerializer,
            queryset=users,
            request=request,
            view=self,
        )


class UserUpdateApi(ApiAuthMixin, APIView):
    class InputSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = ("full_name",)

    def patch(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        user_update(user=user, data=serializer.validated_data)

        return Response(status=status.HTTP_200_OK)
