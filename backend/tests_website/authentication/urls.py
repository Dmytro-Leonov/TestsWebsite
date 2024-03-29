from django.urls import include, path
from knox.views import LogoutView

from .apis import (
    UserMeApi,
    GoogleLoginApi,
)

login_patterns = [
    path("google/", GoogleLoginApi.as_view(), name="google"),
]

urlpatterns = [
    path("me/", UserMeApi.as_view(), name="me"),
    path("login/", include(login_patterns)),
    path("logout/", LogoutView.as_view(), name="logout")
]
