# Generated by Django 4.1.7 on 2023-05-29 12:58

import datetime
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('questions', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='GroupTest',
            fields=[
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('is_visible', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=100, validators=[django.core.validators.MinLengthValidator(1)])),
                ('description', models.TextField(blank=True, max_length=500)),
                ('time_limit', models.DurationField(validators=[django.core.validators.MinValueValidator(datetime.timedelta(seconds=1)), django.core.validators.MaxValueValidator(datetime.timedelta(days=1))])),
                ('attempts', models.IntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(10)])),
                ('number_of_questions', models.IntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(1000)])),
                ('score', models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(1000)])),
                ('shuffle_questions', models.BooleanField()),
                ('shuffle_answers', models.BooleanField()),
                ('show_score_after_test', models.BooleanField()),
                ('show_answers_after_test', models.BooleanField()),
                ('give_extra_time', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='TestQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order', models.IntegerField(db_index=True)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='questions.question')),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tests.test')),
            ],
        ),
        migrations.AddField(
            model_name='test',
            name='questions',
            field=models.ManyToManyField(related_name='tests', through='tests.TestQuestion', to='questions.question'),
        ),
    ]
