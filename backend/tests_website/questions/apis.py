from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import status

from tests_website.api.mixins import ApiAuthMixin

from tests_website.questions.models import Question, QuestionPool
from tests_website.questions.utils import validate_max_question_pools
from tests_website.questions.services import question_pool_create
from tests_website.questions.selectors import question_pools_list


class QuestionCreateApi(ApiAuthMixin, APIView):
    class InputSerializer(serializers.ModelSerializer):
        original_question = serializers.PrimaryKeyRelatedField(
            queryset=Question.objects.all(),
            required=False
        )
        question_pool = serializers.PrimaryKeyRelatedField(
            queryset=QuestionPool.objects.all(),
            required=False
        )
        question = serializers.CharField()
        type = serializers.ChoiceField(choices=Question.QuestionType.choices)
        is_original = serializers.BooleanField(default=True)
        order = serializers.CharField()

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Question
            fields = "__all__"

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = serializer.save()

        serializer = self.OutputSerializer(question)

        return Response(serializer.data, status.HTTP_201_CREATED)


class QuestionPoolCreateApi(ApiAuthMixin, APIView):
    class InputSerializer(serializers.ModelSerializer):
        class Meta:
            model = QuestionPool
            fields = ("name",)

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = QuestionPool
            fields = ("id", "name")

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validate_max_question_pools(user=self.request.user)

        question_pool = question_pool_create(
            **serializer.validated_data, user=self.request.user
        )

        serializer = self.OutputSerializer(question_pool)

        return Response(serializer.data, status.HTTP_201_CREATED)


class QuestionPoolListApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        name = serializers.CharField()
        questions_count = serializers.IntegerField()

        class Meta:
            model = QuestionPool
            fields = ("id", "name", "questions_count")

    def get(self, request):
        question_pools = question_pools_list(user=self.request.user)
        serializer = self.OutputSerializer(question_pools, many=True)
        return Response(serializer.data, status.HTTP_200_OK)
