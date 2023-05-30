# Generated by Django 4.1.7 on 2023-05-29 17:01

from django.db import migrations
import pgtrigger.compiler
import pgtrigger.migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0002_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='question',
            unique_together={('question_pool', 'question')},
        ),
        pgtrigger.migrations.AddTrigger(
            model_name='question',
            trigger=pgtrigger.compiler.Trigger(name='update_answers_order_on_update', sql=pgtrigger.compiler.UpsertTriggerSql(func='\n                IF NOT pg_trigger_depth() > 1 THEN\n                    IF NEW."order" > OLD."order" THEN\n                        UPDATE questions_question\n                        SET "order" = "order" - 1\n                        WHERE "order" > OLD."order" AND "order" <= NEW."order";\n                    ELSEIF NEW."order" < OLD."order" THEN\n                        UPDATE questions_question\n                        SET "order" = "order" + 1\n                        WHERE "order" >= NEW."order" AND "order" < OLD."order";\n                    END IF;\n                END IF;\n                RETURN NEW;\n                ', hash='d7adfd2c32a07a58a8f3729008f9e212bc50d449', operation='UPDATE', pgid='pgtrigger_update_answers_order_on_update_b1451', table='questions_question', when='BEFORE')),
        ),
        pgtrigger.migrations.AddTrigger(
            model_name='question',
            trigger=pgtrigger.compiler.Trigger(name='update_answers_order_on_delete', sql=pgtrigger.compiler.UpsertTriggerSql(func='\n                IF NOT pg_trigger_depth() > 1 THEN\n                    UPDATE questions_question\n                    SET "order" = "order" - 1\n                    WHERE "order" > OLD."order";\n                END IF;\n                RETURN OLD;\n                ', hash='df90d33732d0e00eb97ea6bae5254e96f38f4021', operation='DELETE', pgid='pgtrigger_update_answers_order_on_delete_66a6c', table='questions_question', when='BEFORE')),
        ),
    ]