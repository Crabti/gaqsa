# Generated by Django 3.2.9 on 2021-12-08 22:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0018_alter_productprovider_unique_together'),
    ]

    operations = [
        migrations.AddField(
            model_name='productprovider',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]