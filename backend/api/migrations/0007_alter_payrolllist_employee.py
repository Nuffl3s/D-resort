# Generated by Django 5.1.3 on 2025-01-07 02:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_payroll_last_deduction_reset'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payrolllist',
            name='employee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payrolls', to='api.employee'),
        ),
    ]
