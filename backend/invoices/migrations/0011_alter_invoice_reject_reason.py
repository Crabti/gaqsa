# Generated by Django 3.2.10 on 2022-03-02 02:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoices', '0010_invoice_is_client_responsible'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='reject_reason',
            field=models.CharField(blank=True, default='N/A', max_length=500),
        ),
    ]