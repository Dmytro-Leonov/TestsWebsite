from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import status

from tests_website.api.utils import inline_serializer
from tests_website.api.mixins import ApiAuthMixin

from tests_website.questions.models import Question, QuestionPool
from tests_website.questions.utils import validate_max_question_pools
from tests_website.questions.services import (
    question_create,
    question_pool_create,
    question_pool_update,
    question_details,
    question_update,
)
from tests_website.questions.selectors import question_pools_list, question_pool_details


class QuestionCreateApi(ApiAuthMixin, APIView):
    class Serializer(serializers.Serializer):
        id = serializers.IntegerField(required=False, read_only=True)
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
        order = serializers.IntegerField(default=1)
        answers = inline_serializer(fields={
            "id": serializers.IntegerField(read_only=True),
            "answer": serializers.CharField(),
            "is_correct": serializers.BooleanField(),
            "order": serializers.IntegerField(),
        }, many=True)

    def post(self, request):
        serializer = self.Serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = question_create(user=self.request.user, **serializer.validated_data)

        serializer = self.Serializer(question)

        return Response(serializer.data, status.HTTP_201_CREATED)


class QuestionUpdateApi(ApiAuthMixin, APIView):
    class Serializer(serializers.Serializer):
        question = serializers.CharField()
        type = serializers.ChoiceField(choices=Question.QuestionType.choices)
        answers = inline_serializer(fields={
            "answer": serializers.CharField(),
            "is_correct": serializers.BooleanField(),
            "order": serializers.IntegerField(),
        }, many=True)

    def post(self, request, question_id):
        serializer = self.Serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question_update(user=self.request.user, id=question_id, **serializer.validated_data)

        return Response(status.HTTP_200_OK)


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


class QuestionPoolDetailApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        name = serializers.CharField()
        questions = inline_serializer(many=True, fields={
            "id": serializers.IntegerField(),
            "question": serializers.CharField(),
            "type": serializers.ChoiceField(choices=Question.QuestionType.choices),
            "is_original": serializers.BooleanField(),
            "order": serializers.IntegerField(),
        })

    def get(self, request, question_pool_id):
        question_pool = question_pool_details(question_pool_id=question_pool_id)
        serializer = self.OutputSerializer(question_pool)
        return Response(serializer.data, status.HTTP_200_OK)


class QuestionPoolUpdateApi(ApiAuthMixin, APIView):
    class InputSerializer(serializers.ModelSerializer):
        class Meta:
            model = QuestionPool
            fields = ("name",)

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = QuestionPool
            fields = ("name",)

    def post(self, request, question_pool_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question_pool = get_object_or_404(QuestionPool, id=question_pool_id)
        question_pool = question_pool_update(
            question_pool=question_pool, **serializer.validated_data
        )

        serializer = self.OutputSerializer(question_pool)

        return Response(serializer.data, status.HTTP_200_OK)


class QuestionPoolDeleteApi(ApiAuthMixin, APIView):
    def delete(self, request, question_pool_id):
        question_pool = get_object_or_404(QuestionPool, id=question_pool_id)

        if question_pool.user != self.request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        question_pool.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class QuestionDeleteApi(ApiAuthMixin, APIView):
    def delete(self, request, question_id):
        question = get_object_or_404(Question, id=question_id)

        if question.user != self.request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        question.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class QuestionUpdateOrderApi(ApiAuthMixin, APIView):
    class InputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Question
            fields = ("order",)

    def post(self, request, question_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = get_object_or_404(Question, id=question_id)

        if question.user != self.request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        question.order = serializer.validated_data["order"]
        question.save()

        return Response(status=status.HTTP_200_OK)


class QuestionDetailsApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        question_pool_id = serializers.IntegerField()
        question = serializers.CharField()
        type = serializers.ChoiceField(choices=Question.QuestionType.choices)
        answers = inline_serializer(fields={
            "id": serializers.IntegerField(),
            "answer": serializers.CharField(),
            "is_correct": serializers.BooleanField(),
            "order": serializers.IntegerField(),
        }, many=True)

    def get(self, request, question_id):
        user = self.request.user
        question = question_details(question_id=question_id)

        if question.user != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = self.OutputSerializer(question)

        return Response(serializer.data, status.HTTP_200_OK)

