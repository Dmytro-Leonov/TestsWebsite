from django.db import models
from django.core.validators import MinLengthValidator, MinValueValidator, MaxValueValidator
from tests_website.common.models import BaseModel


# TODO: add question pool
class Test(BaseModel):
    creator = models.ForeignKey("auth.User", on_delete=models.CASCADE, related_name="created_tests")

    name = models.CharField(max_length=100, validators=[MinLengthValidator(1)])
    description = models.TextField(max_length=500, blank=True)
    time_limit_seconds = models.IntegerField(validators=[MinValueValidator(1)])
    attempts = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(10)])

    shuffle_questions = models.BooleanField()
    shuffle_answers = models.BooleanField()
    show_score_after_test = models.BooleanField()
    show_answers_after_test = models.BooleanField()

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ("creator", "name")
