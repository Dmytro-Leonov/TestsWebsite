# Generated by Django 4.1.7 on 2023-05-30 15:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0004_remove_question_update_answers_order_on_update_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='question',
            options={'ordering': ['order']},
        ),
    ]
