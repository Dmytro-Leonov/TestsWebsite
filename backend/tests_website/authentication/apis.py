from urllib.parse import urlencode

from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from django.conf import settings
from django.shortcuts import redirect

from tests_website.api.mixins import ApiAuthMixin
from tests_website.authentication.services import google_get_access_token, google_get_user_info, knox_login
from tests_website.users.selectors import user_get_login_data
from tests_website.users.services import user_get_or_create


class UserMeApi(ApiAuthMixin, APIView):
    def get(self, request):
        data = user_get_login_data(user=request.user)

        return Response(data)


class GoogleLoginApi(APIView):
    class InputSerializer(serializers.Serializer):
        code = serializers.CharField(required=False)
        error = serializers.CharField(required=False)

    def get(self, request, *args, **kwargs):
        serializer = self.InputSerializer(data=request.GET)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        code = validated_data.get("code")
        error = validated_data.get("error')

        if error or not code:
            login_url = f'{settings.FRONTEND_DOMAIN}/login'
            params = urlencode({'error': error})

            return redirect(f'{login_url}?{params}')

        access_token = google_get_access_token(code=code)

        profile_data = google_get_user_info(access_token=access_token)

        user, _ = user_get_or_create(**profile_data)

        response = knox_login(user=user)

        return response
