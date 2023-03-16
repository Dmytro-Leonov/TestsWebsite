from rest_framework.response import Response
from rest_framework.views import APIView

from tests_website.api.exception_handlers import (
    drf_default_with_modifications_exception_handler,
    custom_exception_handler,
)
from tests_website.errors.services import trigger_errors
from tests_website.users.services import user_create


class TriggerErrorApi(APIView):
    def get(self, request):
        data = {
            "drf_default_with_modifications": trigger_errors(drf_default_with_modifications_exception_handler),
            "custom_exception_handler": trigger_errors(custom_exception_handler),
        }

        return Response(data)


class TriggerValidateUniqueErrorApi(APIView):
    def get(self, request):
        # Due to the fiddling with transactions, this example a different API
        user_create(email="unique@hacksoft.io", full_name="user")
        user_create(email="unique@hacksoft.io", full_name="user")

        return Response()


class TriggerUnhandledExceptionApi(APIView):
    def get(self, request):
        raise Exception("Oops")
