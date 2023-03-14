from typing import TYPE_CHECKING, Sequence, Type

from rest_framework.authentication import BaseAuthentication, SessionAuthentication
from rest_framework.permissions import BasePermission, IsAuthenticated

from knox.auth import TokenAuthentication

if TYPE_CHECKING:
    # This is going to be resolved in the stub library
    # https://github.com/typeddjango/djangorestframework-stubs/
    from rest_framework.permissions import _PermissionClass

    PermissionClassesType = Sequence[_PermissionClass]
else:
    PermissionClassesType = Sequence[Type[BasePermission]]


class ApiAuthMixin:
    authentication_classes: Sequence[Type[BaseAuthentication]] = [
        TokenAuthentication,
        SessionAuthentication,
    ]
    permission_classes: PermissionClassesType = (IsAuthenticated,)
