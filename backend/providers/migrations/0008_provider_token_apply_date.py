# Generated by Django 3.2.8 on 2021-11-02 19:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('providers', '0007_alter_provider_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='provider',
            name='token_apply_date',
            field=models.DateField(null=True, verbose_name='Fecha de aplicación de codigo'),
        ),
    ]
