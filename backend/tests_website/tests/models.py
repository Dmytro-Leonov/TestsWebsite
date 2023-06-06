from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator

from tests_website.common.models import BaseModel
from tests_website.common.utils import get_now

import uuid
from datetime import timedelta


class Test(BaseModel):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="created_tests")
    question_pool = models.ForeignKey("questions.QuestionPool", on_delete=models.SET_NULL, null=True, blank=True)
    group = models.ForeignKey("groups.Group", on_delete=models.CASCADE)
    questions = models.ManyToManyField("questions.Question", through="TestQuestion", related_name="tests")

    name = models.CharField(max_length=100, validators=[MinLengthValidator(1)])
    description = models.TextField(max_length=500, blank=True)

    time_limit = models.DurationField(validators=[
        MinValueValidator(timedelta(seconds=1)),
        MaxValueValidator(timedelta(hours=24))
    ])
    start_date = models.DateTimeField(blank=False, null=False)
    end_date = models.DateTimeField(blank=False, null=False)

    attempts = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    score = models.FloatField(validators=[MinValueValidator(1), MaxValueValidator(1000)])

    shuffle_questions = models.BooleanField()
    shuffle_answers = models.BooleanField()
    show_score_after_test = models.BooleanField()
    show_answers_after_test = models.BooleanField()
    give_extra_time = models.BooleanField(default=False)

    def clean(self):
        if not self.start_date:
            raise ValidationError({"start_date": "Start date is required"})
        if not self.end_date:
            raise ValidationError({"end_date": "End date is required"})
        if self.start_date >= self.end_date:
            raise ValidationError({"end_date": "End date cannot be before start date"})
        print(self.end_date, get_now())
        if self.end_date < get_now():
            raise ValidationError({"end_date": "End date cannot be in the past"})
        if self.time_limit > self.end_date - self.start_date:
            raise ValidationError({"time_limit": "Time limit cannot be longer than test duration"})

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "user", "name",
                name="unique_test_name",
                violation_error_message="You have already created test with this name"
            )
        ]

    def __str__(self):
        return self.name


class TestQuestion(BaseModel):
    test = models.ForeignKey("Test", on_delete=models.CASCADE)
    question = models.ForeignKey("questions.Question", on_delete=models.CASCADE)

    order = models.IntegerField(db_index=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "test", "question",
                name="unique_test_question",
                violation_error_message="Each question can be added to test only once"
            ),
            models.UniqueConstraint(
                "test", "order",
                name="unique_test_question_order",
                violation_error_message="An error occurred, refresh the page and try again"
            )
        ]
        unique_together = [("test", "question", "order")]

    def __str__(self):
        return f"{self.test} - {self.question}"


class Attempt(BaseModel):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    test = models.ForeignKey("Test", on_delete=models.CASCADE, related_name="attempts_set")

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def __str__(self):
        return f"{self.id} - {self.user} - {self.test}"


class AttemptQuestion(BaseModel):
    attempt = models.ForeignKey("Attempt", on_delete=models.CASCADE)
    question = models.ForeignKey("questions.Question", on_delete=models.CASCADE)
    order = models.IntegerField(db_index=True)
    points = models.FloatField(default=0)
    has_answer = models.BooleanField(default=False)
    marked_as_answered = models.BooleanField(default=False)


class AttemptAnswer(BaseModel):
    attempt_question = models.ForeignKey("AttemptQuestion", on_delete=models.CASCADE)
    answer = models.ForeignKey("questions.Answer", on_delete=models.CASCADE)
    order = models.IntegerField(db_index=True)
    is_selected = models.BooleanField(default=False)
    is_correct = models.BooleanField(default=False)


class Log(BaseModel):
    attempt = models.ForeignKey("Attempt", on_delete=models.CASCADE)
    question = models.ForeignKey("questions.Question", on_delete=models.CASCADE, null=True, blank=True)
    answer = models.ForeignKey("questions.Answer", on_delete=models.CASCADE, null=True, blank=True)

    class LogAction(models.TextChoices):
        ENTERED_QUESTION = "ENTERED_QUESTION", "Entered question"
        SELECTED_ANSWER = "SELECTED_ANSWER", "Selected answer"
        DESELECTED_ANSWER = "DESELECTED_ANSWER", "Deselected answer"
        MARKED_AS_ANSWERED = "MARKED_AS_ANSWERED", "Marked as answered"
        UNMARKED_AS_ANSWERED = "UNMARKED_AS_ANSWERED", "Unmarked as answered"

    action = models.CharField(max_length=20, choices=LogAction.choices)

    def __str__(self):
        return f"{self.created_at} - {self.action}"
