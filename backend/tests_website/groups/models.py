from django.db import models
from django.db.models import UniqueConstraint
from django.core.validators import MinLengthValidator

from tests_website.common.models import BaseModel


class Group(BaseModel):
    name = models.CharField(max_length=100, validators=[MinLengthValidator(1)])
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="created_groups")

    members = models.ManyToManyField("users.User", through="GroupMember", related_name="member_of_groups")


    class Meta:
        constraints = [
            UniqueConstraint(
                "user", "name",
                name="unique_group_name_for_user",
                violation_error_message="You have already created a group with this name"
            )
        ]

    def __str__(self):
        return f"{self.name} - {self.user}"


class GroupMember(BaseModel):
    group = models.ForeignKey("Group", on_delete=models.CASCADE, related_name="+")
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="+")

    class Meta:
        constraints = [
            UniqueConstraint(
                "group", "user",
                name="unique_group_member",
                violation_error_message="This user is already a member of this group"
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.group}"
