# Generated by Django 4.1.7 on 2023-06-03 20:26

from django.db import migrations
import pgtrigger.compiler
import pgtrigger.migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0009_remove_question_update_answers_order_on_delete_and_more'),
    ]

    operations = [
        pgtrigger.migrations.RemoveTrigger(
            model_name='question',
            name='update_answers_order_on_delete',
        ),
        pgtrigger.migrations.AddTrigger(
            model_name='question',
            trigger=pgtrigger.compiler.Trigger(name='update_answers_order_on_delete', sql=pgtrigger.compiler.UpsertTriggerSql(func='\n                IF NOT pg_trigger_depth() > 1 THEN\n                    UPDATE questions_question\n                    SET "order" = "order" - 1\n                    WHERE "order" > OLD."order" AND question_pool_id = OLD.question_pool_id;\n                END IF;\n                \n                UPDATE questions_questionpool\n                SET questions_count = questions_count - 1\n                WHERE id = OLD.question_pool_id;\n                \n                RETURN OLD;\n                ', hash='246548b2e3f3884fbc393f7fec5374cf1bb6364a', operation='DELETE', pgid='pgtrigger_update_answers_order_on_delete_66a6c', table='questions_question', when='AFTER')),
        ),
    ]
