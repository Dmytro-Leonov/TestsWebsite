from django.db import models
from django.core.validators import MinLengthValidator
from django.db.models import UniqueConstraint

import pgtrigger

from tests_website.common.models import BaseModel


class QuestionPool(BaseModel):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="question_pools")

    name = models.CharField(max_length=100, validators=[MinLengthValidator(1)])

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            UniqueConstraint(
                "user", "name",
                name="unique_question_pool_name_for_user",
                violation_error_message="You have already created a question pool with this name"
            )
        ]


class Question(BaseModel):
    original_question = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="copies_in_tests"
    )
    question_pool = models.ForeignKey("QuestionPool", on_delete=models.CASCADE, related_name="questions", null=True)

    question = models.TextField(max_length=2000, validators=[MinLengthValidator(1)])
    is_original = models.BooleanField(default=True)

    order = models.IntegerField(db_index=True)

    class QuestionType(models.TextChoices):
        SINGLE_CHOICE = "SINGLE_CHOICE", "Single choice"
        MULTIPLE_CHOICE = "MULTIPLE_CHOICE", "Multiple choice"

    type = models.CharField(max_length=20, choices=QuestionType.choices, default=QuestionType.SINGLE_CHOICE)

    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="created_questions")

    def __str__(self):
        return f"{self.order} - {self.question}"

    class Meta:
        ordering = ["order"]
        unique_together = [
            ("question_pool", "question"),
        ]
        triggers = [
            pgtrigger.Trigger(
                name="update_answers_order_on_update",
                operation=pgtrigger.Update,
                when=pgtrigger.Before,
                func=
                """
                IF NOT pg_trigger_depth() > 1 THEN
                    IF NEW."order" > OLD."order" THEN
                        UPDATE questions_question
                        SET "order" = "order" - 1
                        WHERE "order" > OLD."order" AND "order" <= NEW."order" AND question_pool_id = OLD.question_pool_id;
                    ELSEIF NEW."order" < OLD."order" THEN
                        UPDATE questions_question
                        SET "order" = "order" + 1
                        WHERE "order" >= NEW."order" AND "order" < OLD."order";
                    END IF;
                END IF;
                RETURN NEW;
                """
            ),
            pgtrigger.Trigger(
                name="update_answers_order_on_delete",
                operation=pgtrigger.Delete,
                when=pgtrigger.Before,
                func=
                """
                IF NOT pg_trigger_depth() > 1 THEN
                    UPDATE questions_question
                    SET "order" = "order" - 1
                    WHERE "order" > OLD."order" AND question_pool_id = OLD.question_pool_id;
                END IF;
                RETURN OLD;
                """
            ),
            pgtrigger.Trigger(
                name="update_answers_order_on_insert",
                operation=pgtrigger.Insert,
                when=pgtrigger.Before,
                func=
                """
                IF NOT pg_trigger_depth() > 1 THEN
                    UPDATE questions_question
                    SET "order" = "order" + 1
                    WHERE "order" >= NEW."order" AND question_pool_id = NEW.question_pool_id;
                END IF;
                RETURN NEW;
                """
            ),
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

    order = models.IntegerField(db_index=True)

    def __str__(self):
        return f"{self.order} - {self.answer}"

    class Meta:
        unique_together = [
            ("question", "answer"),
            ("question", "order")
        ]
        ordering = ["order"]
