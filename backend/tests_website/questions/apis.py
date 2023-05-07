from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import status

from tests_website.api.mixins import ApiAuthMixin

from tests_website.questions.models import Question, QuestionPool


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
