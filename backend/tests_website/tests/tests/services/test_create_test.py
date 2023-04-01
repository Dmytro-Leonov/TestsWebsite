from django.db import IntegrityError
from django.test import TestCase

from tests_website.tests.services import test_create
from tests_website.users.services import user_create
from tests_website.subscriptions.models import Subscription


# TODO: Remake tests
# class CreateTestTests(TestCase):
#
#     def test_create_test_fails_on_exceeding_max_tests_in_subscription(self):
#         user = user_create(
#             full_name="Test User",
#             email="test@test.test",
#         )
#         subscription = Subscription.objects.create(
#             name="Test Subscription",
#             price=0,
#             description="Test Subscription",
#             max_questions=0,
#             max_question_pools=0,
#             max_tests=0,
#             max_groups=0,
#             max_users_in_group=0,
#             max_answers_to_question=0,
#             can_see_logs=False,
#             can_see_statistics=False,
#         )
#
#         with self.assertRaises(IntegrityError):
#             test_create(
#                 user=user,
#                 name="Test Test",
#                 description="Test Test",
#                 time_limit_seconds=10,
#                 attempts=1,
#                 number_of_questions=1,
#                 score=1,
#             )
