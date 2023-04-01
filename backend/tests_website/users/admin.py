from django.contrib import admin, messages
from django.core.exceptions import ValidationError

from tests_website.users.models import User
from tests_website.users.services import user_create


@admin.register(User)
class BaseUserAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "is_admin", "is_superuser", "is_active", "created_at", "updated_at")

    search_fields = ("email",)

    list_filter = ("is_active", "is_admin", "is_superuser")

    fieldsets = (
        (None, {"fields": ("full_name", "email",)}),
        ("Booleans", {"fields": ("is_active", "is_admin", "is_superuser")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )
