import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator

from tests_website.common.models import BaseModel

from django.db.models import UniqueConstraint


class Test(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="created_tests")

    name = models.CharField(max_length=100, validators=[MinLengthValidator(1)])
    description = models.TextField(max_length=500, blank=True)
    time_limit_seconds = models.PositiveIntegerField(validators=[MinValueValidator(1)])
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
            UniqueConstraint(
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

    # order in test calculated using lexorank algorithm
    order = models.CharField(max_length=256, blank=False, null=False, db_index=True)

    class Meta:
        constraints = [
            UniqueConstraint(
                "test", "question",
                name="unique_test_question",
                violation_error_message="Each question can be added to test only once"
            ),
            UniqueConstraint(
                "test", "order",
                name="unique_test_question_order",
                violation_error_message="An error occurred, refresh the page and try again"
            )
        ]
        unique_together = [("test", "question", "order")]

    def __str__(self):
        return f"{self.test} - {self.question}"
