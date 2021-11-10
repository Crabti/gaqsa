# Generated by Django 3.2.8 on 2021-11-07 16:56

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0013_auto_20211107_0107'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='iva',
        ),
        migrations.RemoveField(
            model_name='product',
            name='laboratory',
        ),
        migrations.RemoveField(
            model_name='product',
            name='price',
        ),
        migrations.AlterField(
            model_name='productrequest',
            name='iva',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=5, null=True, validators=[django.core.validators.MinValueValidator(0.0), django.core.validators.MaxValueValidator(100)], verbose_name='IVA'),
        ),
        migrations.AlterField(
            model_name='productrequest',
            name='laboratory',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='products.laboratory'),
        ),
        migrations.AlterField(
            model_name='productrequest',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10, null=True, verbose_name='Precio'),
        ),
    ]
