from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager
)
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.core.validators import MinLengthValidator

from tests_website.common.models import BaseModel


class UserManager(BaseUserManager):
    def create_user(self, full_name, email, is_active=True, is_admin=False, password=None):
        if not full_name:
            raise ValueError("Users must have a full name")
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            full_name=full_name,
            email=self.normalize_email(email.lower()),
            is_active=is_active,
            is_admin=is_admin
        )

        if password is not None:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.full_clean()
        user.save(using=self._db)

        return user

    def create_superuser(self, full_name, email, password=None):
        user = self.create_user(
            full_name=full_name,
            email=email,
            is_active=True,
            is_admin=True,
            password=password,
        )

        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(BaseModel, AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    full_name = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(3)],
        blank=True
    )

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    REQUIRED_FIELDS = ["full_name"]
    USERNAME_FIELD = "email"

    def __str__(self):
        return self.email

    def is_staff(self):
        return self.is_admin
