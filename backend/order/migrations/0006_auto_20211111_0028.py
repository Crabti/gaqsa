# Generated by Django 3.2.9 on 2021-11-11 00:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0005_requisition_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='requisition',
            name='status',
        ),
        migrations.AddField(
            model_name='order',
            name='cancelled',
            field=models.BooleanField(default=False),
        ),
    ]
