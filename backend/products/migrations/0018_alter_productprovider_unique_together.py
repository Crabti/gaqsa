# Generated by Django 3.2.8 on 2021-11-09 01:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0017_alter_productprovider_unique_together'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='productprovider',
            unique_together=set(),
        ),
    ]