from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers, status

from tests_website.tests.models import Test
from tests_website.api.mixins import ApiAuthMixin

from tests_website.tests.services import test_create, test_delete
from tests_website.tests.selectors import test_list_created_by_user


class TestCreateApi(ApiAuthMixin, APIView):
    class InputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Test
            fields = (
                "name",
                "description",
                "question_pool",
                "time_limit",
                "start_date",
                "end_date",
                "attempts",
                "score",
                "shuffle_questions",
                "shuffle_answers",
                "show_score_after_test",
                "show_answers_after_test",
                "give_extra_time",
                "question_pool",
                "group",
            )

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Test
            fields = (
                "id",
                "name",
                "description",
                "question_pool_id",
                "time_limit",
                "start_date",
                "end_date",
                "attempts",
                "score",
                "shuffle_questions",
                "shuffle_answers",
                "show_score_after_test",
                "show_answers_after_test",
                "give_extra_time",
                "created_at",
                "updated_at",
            )

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        test = test_create(user=self.request.user, **serializer.validated_data)
        return Response(self.OutputSerializer(test).data, status=status.HTTP_201_CREATED)


class TestDetailsApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Test
            fields = (
                "id",
                "name",
                "description",
                "question_pool",
                "time_limit",
                "attempts",
                "score",
                "shuffle_questions",
                "shuffle_answers",
                "show_score_after_test",
                "show_answers_after_test",
                "give_extra_time",
                "created_at",
                "updated_at",
            )

    def get(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)

        if test.user != self.request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return Response(self.OutputSerializer(test).data)


class TestListCreatedByUserApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Test
            fields = (
                "id",
                "name",
                "created_at",
            )

    def get(self, request):
        tests = test_list_created_by_user(user=self.request.user)
        return Response(self.OutputSerializer(tests, many=True).data)


class TestDeleteApi(ApiAuthMixin, APIView):
    def delete(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)
        if test.user != self.request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        test_delete(test=test)
        return Response(status=status.HTTP_204_NO_CONTENT)
