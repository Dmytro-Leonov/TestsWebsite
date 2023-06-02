# Generated by Django 4.1.7 on 2023-06-02 09:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0006_question_update_answers_order_on_insert'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='answer',
            options={'ordering': ['order']},
        ),
        migrations.AlterUniqueTogether(
            name='answer',
            unique_together=set(),
        ),
        migrations.AddConstraint(
            model_name='answer',
            constraint=models.UniqueConstraint(models.F('question'), models.F('answer'), name='unique_answer_for_question', violation_error_message='Duplicate answers'),
        ),
    ]
