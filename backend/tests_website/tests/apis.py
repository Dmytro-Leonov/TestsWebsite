from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers, status

from tests_website.tests.models import Test
from tests_website.api.mixins import ApiAuthMixin

from tests_website.tests.services import test_create


class TestCreateApi(ApiAuthMixin, APIView):
    class InputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Test
            fields = (
                "name",
                "description",
                "time_limit",
                "attempts",
                "number_of_questions",
                "score",
                "shuffle_questions",
                "shuffle_answers",
                "show_score_after_test",
                "show_answers_after_test",
                "give_extra_time",
            )

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Test
            fields = (
                "id",
                "name",
                "description",
                "time_limit",
                "attempts",
                "number_of_questions",
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



