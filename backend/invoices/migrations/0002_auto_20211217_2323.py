# Generated by Django 3.2.9 on 2021-12-17 23:23

import django.core.validators
from django.db import migrations, models
import invoices.models


class Migration(migrations.Migration):

    dependencies = [
        ('invoices', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='extra_file',
            field=models.FileField(unique=True, upload_to=invoices.models.get_file_path, validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf'])]),
        ),
        migrations.AlterField(
            model_name='invoice',
            name='invoice_file',
            field=models.FileField(unique=True, upload_to=invoices.models.get_file_path, validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf'])]),
        ),
        migrations.AlterField(
            model_name='invoice',
            name='xml_file',
            field=models.FileField(unique=True, upload_to=invoices.models.get_file_path, validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['xml'])]),
        ),
    ]
