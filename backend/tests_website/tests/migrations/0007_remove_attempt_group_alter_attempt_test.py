# Generated by Django 4.1.7 on 2023-06-04 19:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tests', '0006_attempt_alter_test_give_extra_time_attemptquestion_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='attempt',
            name='group',
        ),
        migrations.AlterField(
            model_name='attempt',
            name='test',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attempts_set', to='tests.test'),
        ),
    ]
