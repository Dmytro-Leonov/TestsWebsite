# Generated by Django 4.1.7 on 2023-06-03 10:35

from django.db import migrations, models
import pgtrigger.compiler
import pgtrigger.migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0008_alter_question_unique_together'),
    ]

    operations = [
        pgtrigger.migrations.RemoveTrigger(
            model_name='question',
            name='update_answers_order_on_delete',
        ),
        pgtrigger.migrations.RemoveTrigger(
            model_name='question',
            name='update_answers_order_on_insert',
        ),
        migrations.AddField(
            model_name='questionpool',
            name='questions_count',
            field=models.IntegerField(default=0),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name='question',
            trigger=pgtrigger.compiler.Trigger(name='update_answers_order_on_delete', sql=pgtrigger.compiler.UpsertTriggerSql(func='\n                IF NOT pg_trigger_depth() > 1 THEN\n                    UPDATE questions_question\n                    SET "order" = "order" - 1\n                    WHERE "order" > OLD."order" AND question_pool_id = OLD.question_pool_id;\n                END IF;\n                \n                UPDATE questions_questionpool\n                SET questions_count = questions_count - 1\n                WHERE id = OLD.question_pool_id;\n                \n                RETURN OLD;\n                ', hash='a897a6ef9edce0145ed6833169eec768e6065132', operation='DELETE', pgid='pgtrigger_update_answers_order_on_delete_66a6c', table='questions_question', when='BEFORE')),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name='question',
            trigger=pgtrigger.compiler.Trigger(name='update_answers_order_on_insert', sql=pgtrigger.compiler.UpsertTriggerSql(func='\n                IF NOT pg_trigger_depth() > 1 THEN\n                    UPDATE questions_question\n                    SET "order" = "order" + 1\n                    WHERE "order" >= NEW."order" AND question_pool_id = NEW.question_pool_id;\n                END IF;\n                \n                UPDATE questions_questionpool\n                SET questions_count = questions_count + 1\n                WHERE id = NEW.question_pool_id;\n                \n                RETURN NEW;\n                ', hash='d79a00aa8247c8716e8945bb4cb0cbe2fca9b3c4', operation='INSERT', pgid='pgtrigger_update_answers_order_on_insert_50d59', table='questions_question', when='BEFORE')),
        ),
    ]