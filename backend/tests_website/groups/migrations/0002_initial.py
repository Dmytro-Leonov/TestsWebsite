# Generated by Django 4.1.7 on 2023-04-07 10:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('groups', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='groupmember',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='group',
            name='members',
            field=models.ManyToManyField(related_name='member_of_groups', through='groups.GroupMember', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='group',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_groups', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddConstraint(
            model_name='groupmember',
            constraint=models.UniqueConstraint(models.F('group'), models.F('user'), name='unique_group_member', violation_error_message='This user is already a member of this group'),
        ),
        migrations.AddConstraint(
            model_name='group',
            constraint=models.UniqueConstraint(models.F('user'), models.F('name'), name='unique_group_name_for_user', violation_error_message='You have already created a group with this name'),
        ),
    ]
