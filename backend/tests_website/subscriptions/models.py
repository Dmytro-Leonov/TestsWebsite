from django.core.validators import MinLengthValidator
from django.db import models

from tests_website.common.models import BaseModel


class Subscription(BaseModel):
    name = models.CharField(max_length=200, unique=True, validators=[MinLengthValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(max_length=2000, validators=[MinLengthValidator(1)])

    max_questions = models.PositiveIntegerField()
    max_question_pools = models.PositiveIntegerField()
    max_tests = models.PositiveIntegerField()
    max_groups = models.PositiveIntegerField()
    max_users_in_group = models.PositiveIntegerField()
    max_answers_to_question = models.PositiveIntegerField()

    can_see_logs = models.BooleanField()
    can_see_statistics = models.BooleanField()

    def __str__(self):
        return f"{self.name} - {self.price}"
