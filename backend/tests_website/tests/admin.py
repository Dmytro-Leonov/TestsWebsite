from django.contrib import admin

from tests_website.tests.models import Test, TestQuestion

admin.site.register(Test)
admin.site.register(TestQuestion)
