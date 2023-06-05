from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers, status

from tests_website.api.utils import inline_serializer
from tests_website.tests.models import Test, Attempt
from tests_website.api.mixins import ApiAuthMixin

from tests_website.tests.services import (
    test_create,
    test_delete,
    test_update,
    test_start
)
from tests_website.tests.selectors import (
    test_list_created_by_user,
    test_list_to_complete,
    test_get_preview,
    attempt_question_list,
    attempt_question_get
)


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
        question_pool = inline_serializer(many=False, fields={
            "id": serializers.IntegerField(),
            "name": serializers.CharField(),
        })
        group = inline_serializer(many=False, fields={
            "id": serializers.IntegerField(),
            "name": serializers.CharField(),
        })
        questions = inline_serializer(many=True, fields={
            "id": serializers.IntegerField(),
            "question": serializers.CharField(),
        })

        class Meta:
            model = Test
            fields = (
                "id",
                "name",
                "description",
                "question_pool",
                "questions",
                "group",
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


class TestUpdateApi(ApiAuthMixin, APIView):
    class InputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Test
            fields = (
                "name",
                "description",
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
            )

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Test
            fields = "__all__"

    def post(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)

        if test.user != self.request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = self.InputSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        test = test_update(test=test, data=serializer.validated_data)

        return Response(self.OutputSerializer(test).data, status=status.HTTP_200_OK)


class TestListToCompleteApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.ModelSerializer):
        used_attempts = serializers.IntegerField()
        in_progress = serializers.BooleanField()

        class Meta:
            model = Test
            fields = (
                "id",
                "name",
                "description",
                "time_limit",
                "start_date",
                "end_date",
                "attempts",
                "score",
                "used_attempts",
                "in_progress",
            )

    def get(self, request):
        tests = test_list_to_complete(user=self.request.user)
        return Response(self.OutputSerializer(tests, many=True).data)


class TestStartApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.Serializer):
        attempt_id = serializers.IntegerField()

    def post(self, request, test_id):
        test = get_object_or_404(Test, id=test_id)
        attempt_id = test_start(user=self.request.user, test=test)
        return Response({"attempt_id": attempt_id}, status=status.HTTP_200_OK)


class TestGetPreviewApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.ModelSerializer):
        used_attempts = serializers.IntegerField()
        in_progress = serializers.BooleanField()
        last_attempt_id = serializers.IntegerField()

        class Meta:
            model = Test
            fields = (
                "id",
                "name",
                "description",
                "time_limit",
                "start_date",
                "end_date",
                "attempts",
                "score",
                "used_attempts",
                "in_progress",
                "last_attempt_id",
            )

    def get(self, request, test_id):
        test = test_get_preview(user=self.request.user, test_id=test_id)
        if test is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(self.OutputSerializer(test).data)


class TestAttemptAllQuestionsList(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        has_answer = serializers.BooleanField()
        marked_as_answered = serializers.BooleanField()
        order = serializers.IntegerField()

    def get(self, request, attempt_id):
        attempt = get_object_or_404(Attempt, id=attempt_id)

        if attempt.user != self.request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        attempt_questions = attempt_question_list(user=self.request.user, attempt=attempt)

        return Response(self.OutputSerializer(attempt_questions, many=True).data)


class TestAttemptGetQuestionWithAllQuestions(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.Serializer):
        test = inline_serializer(many=False, fields={
            "id": serializers.IntegerField(),
            "name": serializers.CharField(),
            "start_date": serializers.DateTimeField(),
            "end_date": serializers.DateTimeField(),
            "time_limit": serializers.IntegerField(),
        }, required=False)
        questions = inline_serializer(many=True, fields={
            "id": serializers.IntegerField(),
            "has_answer": serializers.BooleanField(),
            "marked_as_answered": serializers.BooleanField(),
            "order": serializers.IntegerField(),
        })
        current_question = inline_serializer(many=False, fields={
            "id": serializers.IntegerField(),
            "question": serializers.CharField(),
            "has_answer": serializers.BooleanField(),
            "marked_as_answered": serializers.BooleanField(),
            "answers": inline_serializer(many=True, fields={
                "id": serializers.IntegerField(),
                "answer": serializers.CharField(),
                "order": serializers.IntegerField(),
                "is_selected": serializers.BooleanField(),
            }),
        }, required=False)

    def get(self, request, test_id, attempt_id, question_number):
        user = self.request.user
        print(test_id, attempt_id, question_number)

        # test = get_object_or_404(Test, id=test_id)
        # question = get_object_or_404(Question, id=question_id, tests=test)
        attempt = get_object_or_404(Attempt, id=attempt_id, user=user)

        questions = attempt_question_list(user=user, attempt=attempt)
        # current_question = attempt_question_get(user=user, attempt_id=attempt_id, question_number=question_number)

        return Response(self.OutputSerializer({
            # "test": test,
            "questions": questions,
            # "current_question": current_question,
        }).data)


class TestAttemptGetQuestion(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.Serializer):
        answers = inline_serializer(many=True, fields={
            "id": serializers.IntegerField(),
            "answer_html": serializers.CharField(),
            "order": serializers.IntegerField(),
            "is_selected": serializers.BooleanField(),
        })

    def get(self, request, attempt_id, question_number):
        question, answers = attempt_question_get(user=self.request.user, attempt_id=attempt_id, question_number=question_number)
        serializer = self.OutputSerializer({"answers": answers})

        res = {
            "question": {
                "id": question.id,
                "question_html": question.question_html,
                "question_type": question.question_type,
                "has_answer": question.has_answer,
                "marked_as_answered": question.marked_as_answered,
            },
            "answers": serializer.data["answers"],
        }
        return Response(res)


