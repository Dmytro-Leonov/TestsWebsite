from django.db import models
from django.core.validators import MinLengthValidator

from tests_website.common.models import BaseModel


class QuestionPool(BaseModel):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="created_question_pools")

    name = models.CharField(max_length=200, validators=[MinLengthValidator(1)])

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ("user", "name")


class Question(BaseModel):
    original_question = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="copies_in_tests"
    )
    question_pool = models.ForeignKey("QuestionPool", on_delete=models.CASCADE, related_name="questions")

    question = models.TextField(max_length=2000, validators=[MinLengthValidator(1)])
    is_original = models.BooleanField(default=True)

    # order in question pool calculated using lexorank algorithm
    order = models.CharField(max_length=256, db_index=True)

    class QuestionType(models.TextChoices):
        SINGLE_CHOICE = "SINGLE_CHOICE", "Single choice"
        MULTIPLE_CHOICE = "MULTIPLE_CHOICE", "Multiple choice"

    type = models.CharField(max_length=20, choices=QuestionType.choices, default=QuestionType.SINGLE_CHOICE)

    def __str__(self):
        return self.question

    class Meta:
        unique_together = [
            ("question_pool", "question"),
            ("question_pool", "order")
        ]


class Answer(BaseModel):
    question = models.ForeignKey("Question", on_delete=models.CASCADE, related_name="answers")
    original_answer = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="copies_in_tests"
    )

    answer = models.TextField(max_length=2000, validators=[MinLengthValidator(1)])
    is_correct = models.BooleanField()

    # order in question pool calculated using lexorank algorithm
    order = models.CharField(max_length=256, db_index=True)

    def __str__(self):
        return self.answer

    class Meta:
        unique_together = [
            ("question", "answer"),
            ("question", "order")
        ]
