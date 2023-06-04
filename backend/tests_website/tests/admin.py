from django.contrib import admin

from tests_website.tests.models import Test, TestQuestion, Attempt, AttemptAnswer, AttemptQuestion

admin.site.register(Test)
admin.site.register(TestQuestion)
admin.site.register(Attempt)
admin.site.register(AttemptAnswer)
admin.site.register(AttemptQuestion)
