# Generated by Django 5.1.3 on 2024-12-19 23:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='payroll',
            name='temp_total_hours',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=5, null=True),
        ),
        migrations.AlterField(
            model_name='payroll',
            name='cash_advance',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='payroll',
            name='deductions',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='payroll',
            name='employee',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.employee'),
        ),
        migrations.AlterField(
            model_name='payroll',
            name='net_pay',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='payroll',
            name='rate',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='payroll',
            name='status',
            field=models.CharField(default='Not yet', max_length=50),
        ),
        migrations.AlterField(
            model_name='payroll',
            name='total_hours',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=5),
        ),
    ]
