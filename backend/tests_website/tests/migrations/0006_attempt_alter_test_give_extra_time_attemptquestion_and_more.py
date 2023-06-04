# Generated by Django 4.1.7 on 2023-06-04 18:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0010_remove_question_update_answers_order_on_delete_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('groups', '0003_alter_groupmember_group_alter_groupmember_user'),
        ('tests', '0005_test_end_date_test_group_test_start_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attempt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groups.group')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='test',
            name='give_extra_time',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='AttemptQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order', models.IntegerField(db_index=True)),
                ('points', models.PositiveIntegerField(default=0)),
                ('has_answer', models.BooleanField(default=False)),
                ('marked_as_answered', models.BooleanField(default=False)),
                ('attempt', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tests.attempt')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='questions.question')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AttemptAnswer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order', models.IntegerField(db_index=True)),
                ('is_selected', models.BooleanField()),
                ('is_correct', models.BooleanField()),
                ('is_marked', models.BooleanField()),
                ('answer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='questions.answer')),
                ('attempt_question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tests.attemptquestion')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='attempt',
            name='test',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tests.test'),
        ),
        migrations.AddField(
            model_name='attempt',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
