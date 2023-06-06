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
    test_start,
    attempt_answer_select,
    record_answer_select,
    attempt_question_mark_as_answered,
    attempt_finish,
)
from tests_website.tests.selectors import (
    test_list_created_by_user,
    test_list_to_complete,
    test_get_preview,
    attempt_question_list,
    attempt_question_get,
    attempt_test_details,
    get_user_attempts,
    test_stats,
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
                "description",
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
    class OutputSerializer(serializers.Serializer):
        test = inline_serializer(many=False, fields={
            "id": serializers.IntegerField(),
            "name": serializers.CharField(),
            "description": serializers.CharField(),
            "time_limit": serializers.DurationField(),
            "start_date": serializers.DateTimeField(),
            "end_date": serializers.DateTimeField(),
            "attempts": serializers.IntegerField(),
            "score": serializers.FloatField(),
            "used_attempts": serializers.IntegerField(),
            "in_progress": serializers.BooleanField(),
            "last_attempt_id": serializers.IntegerField(),
            "show_score_after_test": serializers.BooleanField(),
        })
        user_attempts = inline_serializer(many=True, fields={
            "id": serializers.IntegerField(),
            "score": serializers.FloatField(),
            "start_date": serializers.DateTimeField(),
            "end_date": serializers.DateTimeField(),
        })

    def get(self, request, test_id):
        test = test_get_preview(user=self.request.user, test_id=test_id)
        if test is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user_attempts = get_user_attempts(user=self.request.user, test_id=test_id)
        serializer = self.OutputSerializer({
            "test": test,
            "user_attempts": user_attempts,
        }).data

        return Response(serializer)


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


class AttemptAnswerSelect(ApiAuthMixin, APIView):
    class InputSerializer(serializers.Serializer):
        selected = serializers.BooleanField()

    def post(self, request, attempt_answer_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attempt_id, answer_id = attempt_answer_select(user=self.request.user, attempt_answer_id=attempt_answer_id, **serializer.validated_data)
        record_answer_select(attempt_id=attempt_id, answer_id=answer_id, **serializer.validated_data)
        return Response(status=status.HTTP_200_OK)


class AttemptQuestionMarkAsAnswered(ApiAuthMixin, APIView):
    class InputSerializer(serializers.Serializer):
        answered = serializers.BooleanField()

    def post(self, request, attempt_question_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attempt_question_mark_as_answered(attempt_question_id=attempt_question_id, **serializer.validated_data)
        attempt_question_mark_as_answered(attempt_question_id=attempt_question_id, **serializer.validated_data)
        return Response(status=status.HTTP_200_OK)


class AttemptTestDetails(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.ModelSerializer):
        test = inline_serializer(fields={
            "id": serializers.IntegerField(),
            "name": serializers.CharField(),
        })

        class Meta:
            model = Attempt
            fields = (
                "id",
                "test",
                "user",
                "start_date",
                "end_date",
            )

    def get(self, request, attempt_id):
        attempt = attempt_test_details(user=self.request.user, attempt_id=attempt_id)
        serializer = self.OutputSerializer(attempt)
        return Response(serializer.data)


class AttemptFinish(ApiAuthMixin, APIView):
    def post(self, request, attempt_id):
        attempt_finish(user=self.request.user, attempt_id=attempt_id)
        return Response(status=status.HTTP_200_OK)


class TestStatsApi(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.Serializer):
        test = inline_serializer(many=False, fields={
            "id": serializers.IntegerField(),
            "name": serializers.CharField(),
            "score": serializers.FloatField(),
            "time_limit": serializers.DurationField(),
            "total_questions_answered": serializers.IntegerField(),
            "correctly_answered_questions": serializers.IntegerField(),
            "incorrectly_answered_questions": serializers.IntegerField(),
            "not_answered_questions": serializers.IntegerField(),
        })
        attempts = inline_serializer(many=False, fields={
            "max_score": serializers.FloatField(),
            "min_score": serializers.FloatField(),
            "avg_score": serializers.FloatField(),
            "max_time_taken": serializers.DurationField(),
            "min_time_taken": serializers.DurationField(),
            "avg_time_taken": serializers.DurationField(),
        })
        questions = inline_serializer(many=True, fields={
            "id": serializers.IntegerField(),
            "question": serializers.CharField(),
            "type": serializers.CharField(),
            "correctly_answered": serializers.IntegerField(),
            "incorrectly_answered": serializers.IntegerField(),
            "not_answered": serializers.IntegerField(),
            "answers": inline_serializer(many=True, fields={
                "id": serializers.IntegerField(),
                "answer": serializers.CharField(),
                "chosen": serializers.IntegerField(),
                "is_correct": serializers.BooleanField(),
            })
        })

    def get(self, request, test_id):
        test, attempts, questions = test_stats(user=self.request.user, test_id=test_id)
        serializer = self.OutputSerializer({
            "test": test,
            "attempts": attempts,
            "questions": questions,
        })
        return Response(serializer.data)
