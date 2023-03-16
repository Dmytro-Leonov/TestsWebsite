from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator

from tests_website.common.models import BaseModel


class Test(BaseModel):
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE, related_name="created_tests")

    name = models.CharField(max_length=100, validators=[MinLengthValidator(1)])
    description = models.TextField(max_length=500, blank=True)
    time_limit_seconds = models.IntegerField(validators=[MinValueValidator(1)])
    attempts = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(10)])
    number_of_questions = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(1000)])
    score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(1000)])

    shuffle_questions = models.BooleanField()
    shuffle_answers = models.BooleanField()
    show_score_after_test = models.BooleanField()
    show_answers_after_test = models.BooleanField()

    questions = models.ManyToManyField("Question", through="TestQuestion", related_name="tests")

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ("user", "name")


class TestQuestion(BaseModel):
    test = models.ForeignKey("Test", on_delete=models.CASCADE, related_name="test")
    question = models.ForeignKey("Question", on_delete=models.CASCADE, related_name="question")

    # order in test calculated using lexorank algorithm
    order = models.CharField(blank=False, null=False, db_index=True)

    class Meta:
        unique_together = [
            ("test", "question"),
            ("test", "order")
        ]
