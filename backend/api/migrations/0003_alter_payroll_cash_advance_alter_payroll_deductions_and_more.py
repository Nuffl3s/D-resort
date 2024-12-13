# Generated by Django 5.1.3 on 2024-12-19 00:56

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_payroll_cash_advance_alter_payroll_deductions_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payroll',
            name='cash_advance',
            field=models.DecimalField(decimal_places=2, max_digits=10),
        ),
        migrations.AlterField(
            model_name='payroll',
            name='deductions',
            field=models.DecimalField(decimal_places=2, max_digits=10),
        ),
        migrations.AlterField(
            model_name='payroll',
            name='net_pay',
            field=models.DecimalField(decimal_places=2, default=django.utils.timezone.now, editable=False, max_digits=10),
            preserve_default=False,
        ),
    ]
