# Generated by Django 4.1.7 on 2023-06-08 20:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('groups', '0003_alter_groupmember_group_alter_groupmember_user'),
        ('tests', '0014_alter_attemptquestion_points_alter_test_score_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attempt',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attempts_set', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='log',
            name='question',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tests.attemptquestion'),
        ),
        migrations.AlterField(
            model_name='test',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tests', to='groups.group'),
        ),
    ]
