# Generated by Django 4.1.7 on 2023-05-05 20:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tests', '0001_initial'),
        ('groups', '0002_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='test',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_tests', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='grouptest',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groups.group'),
        ),
        migrations.AddField(
            model_name='grouptest',
            name='test',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tests.test'),
        ),
        migrations.AddConstraint(
            model_name='testquestion',
            constraint=models.UniqueConstraint(models.F('test'), models.F('question'), name='unique_test_question', violation_error_message='Each question can be added to test only once'),
        ),
        migrations.AddConstraint(
            model_name='testquestion',
            constraint=models.UniqueConstraint(models.F('test'), models.F('order'), name='unique_test_question_order', violation_error_message='An error occurred, refresh the page and try again'),
        ),
        migrations.AlterUniqueTogether(
            name='testquestion',
            unique_together={('test', 'question', 'order')},
        ),
        migrations.AddConstraint(
            model_name='test',
            constraint=models.UniqueConstraint(models.F('user'), models.F('name'), name='unique_test_name', violation_error_message='You have already created test with this name'),
        ),
        migrations.AddConstraint(
            model_name='grouptest',
            constraint=models.UniqueConstraint(models.F('group'), models.F('test'), name='unique_group_test', violation_error_message='This test is already added to this group'),
        ),
    ]
