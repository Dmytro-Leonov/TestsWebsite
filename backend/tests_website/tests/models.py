from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator

from tests_website.common.models import BaseModel
from tests_website.common.utils import get_now

import uuid
from datetime import timedelta


class Test(BaseModel):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="created_tests")

    name = models.CharField(max_length=100, validators=[MinLengthValidator(1)])
    description = models.TextField(max_length=500, blank=True)
    time_limit = models.DurationField(validators=[
        MinValueValidator(timedelta(seconds=1)),
        MaxValueValidator(timedelta(hours=24))
    ])
    attempts = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    number_of_questions = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(1000)])
    score = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(1000)])

    shuffle_questions = models.BooleanField()
    shuffle_answers = models.BooleanField()
    show_score_after_test = models.BooleanField()
    show_answers_after_test = models.BooleanField()

    give_extra_time = models.BooleanField()

    questions = models.ManyToManyField("questions.Question", through="TestQuestion", related_name="tests")

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


class GroupTest(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    group = models.ForeignKey("groups.Group", on_delete=models.CASCADE)
    test = models.ForeignKey("Test", on_delete=models.CASCADE)

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    is_visible = models.BooleanField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "group", "test",
                name="unique_group_test",
                violation_error_message="This test is already added to this group"
            )
        ]

    def clean(self):
        if self.start_date > self.end_date:
            raise ValidationError({"end_date": "End date cannot be before start date"})

    @property
    def has_started(self):
        return self.start_date <= get_now()

    @property
    def has_ended(self):
        return self.end_date <= get_now()

    def __str__(self):
        return f"{self.group} - {self.test}"


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
