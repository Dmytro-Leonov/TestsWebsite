import requests
from typing import Dict, Any

from django.conf import settings
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from django.shortcuts import redirect
from django.urls import reverse
from django.utils.http import urlencode

from knox.models import AuthToken

from tests_website.users.models import User


GOOGLE_ID_TOKEN_INFO_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo"
GOOGLE_ACCESS_TOKEN_OBTAIN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


def knox_login(*, user: User) -> HttpResponse:
    token = AuthToken.objects.create(user)[1]

    login_url = f"{settings.FRONTEND_DOMAIN}/login"
    params = urlencode({"token": token})

    response = redirect(f"{login_url}?{params}")

    return response


def google_validate_id_token(*, id_token: str) -> bool:
    # Reference: https://developers.google.com/identity/sign-in/web/backend-auth#verify-the-integrity-of-the-id-token
    response = requests.get(
        GOOGLE_ID_TOKEN_INFO_URL,
        params={"id_token": id_token}
    )

    if not response.ok:
        raise ValidationError("id_token is invalid.")

    audience = response.json()["aud"]

    if audience != settings.GOOGLE_OAUTH2_CLIENT_ID:
        raise ValidationError("Invalid audience.")

    return True


def google_get_access_token(*, code: str) -> str:
    domain = settings.APP_DOMAIN
    api_uri = reverse("api:authentication:google")
    redirect_uri = f"{domain}{api_uri}"

    data = {
        "code": code,
        "client_id": settings.GOOGLE_OAUTH2_CLIENT_ID,
        "client_secret": settings.GOOGLE_OAUTH2_CLIENT_SECRET,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }

    response = requests.post(GOOGLE_ACCESS_TOKEN_OBTAIN_URL, data=data)

    if not response.ok:
        raise ValidationError("Failed to obtain access token from Google.")

    access_token = response.json()["access_token"]

    return access_token


def google_get_user_info(*, access_token: str) -> Dict[str, Any]:
    response = requests.get(
        GOOGLE_USER_INFO_URL,
        params={"access_token': access_token}
    )

    if not response.ok:
        raise ValidationError('Failed to obtain user info from Google.')

    user_data = response.json()

    profile_data = {
        'email': user_data['email'],
        'full_name': user_data.get('name'),
    }

    return profile_data
