from django.urls import include, path

urlpatterns = [
    path("auth/", include(("tests_website.authentication.urls", "authentication"))),
    path("users/", include(("tests_website.users.urls", "users"))),
    path("errors/", include(("tests_website.errors.urls", "errors"))),
]
