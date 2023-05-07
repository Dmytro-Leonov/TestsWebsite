from django.contrib import admin

from tests_website.groups.models import Group, GroupMember

admin.site.register(Group)
admin.site.register(GroupMember)
