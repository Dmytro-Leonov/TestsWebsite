# Generated by Django 4.1.7 on 2023-06-03 11:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0009_remove_question_update_answers_order_on_delete_and_more'),
        ('tests', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='test',
            name='question_pool',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='questions.questionpool'),
        ),
    ]
