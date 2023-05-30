from django.contrib import admin

from tests_website.questions.models import Question, QuestionPool, Answer


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    pass


@admin.register(QuestionPool)
class QuestionPoolAdmin(admin.ModelAdmin):
    pass


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    pass
