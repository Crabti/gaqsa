# Generated by Django 3.2.8 on 2021-11-02 19:18

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('offers', '0002_alter_offer_ending_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='offer',
            name='discount_percentage',
            field=models.DecimalField(decimal_places=15, max_digits=16, validators=[django.core.validators.MinValueValidator(0.01), django.core.validators.MaxValueValidator(1)]),
        ),
    ]