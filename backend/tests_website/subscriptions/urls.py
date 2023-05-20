from django.urls import path

from tests_website.subscriptions.apis import (
    SubscriptionDetailsForUser,
)

urlpatterns = [
    path("subscription/<int:id>/", SubscriptionDetailsForUser.as_view(), name="details"),
]