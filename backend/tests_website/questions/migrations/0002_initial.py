# Generated by Django 4.1.7 on 2023-04-06 11:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('questions', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='questionpool',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_question_pools', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='question',
            name='original_question',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='copies_in_tests', to='questions.question'),
        ),
        migrations.AddField(
            model_name='question',
            name='question_pool',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='questions.questionpool'),
        ),
        migrations.AddField(
            model_name='answer',
            name='original_answer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='copies_in_tests', to='questions.answer'),
        ),
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='questions.question'),
        ),
        migrations.AlterUniqueTogether(
            name='questionpool',
            unique_together={('user', 'name')},
        ),
        migrations.AlterUniqueTogether(
            name='question',
            unique_together={('question_pool', 'order'), ('question_pool', 'question')},
        ),
        migrations.AlterUniqueTogether(
            name='answer',
            unique_together={('question', 'answer'), ('question', 'order')},
        ),
    ]