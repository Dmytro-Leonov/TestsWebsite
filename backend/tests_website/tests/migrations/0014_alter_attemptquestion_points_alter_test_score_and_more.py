# Generated by Django 4.1.7 on 2023-06-06 18:09

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tests', '0013_alter_log_action'),
    ]

    operations = [
        migrations.AlterField(
            model_name='attemptquestion',
            name='points',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='test',
            name='score',
            field=models.FloatField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(1000)]),
        ),
        migrations.DeleteModel(
            name='GroupTest',
        ),
    ]