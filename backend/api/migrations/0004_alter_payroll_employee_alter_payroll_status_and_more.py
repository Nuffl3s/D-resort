# Generated by Django 5.0.7 on 2024-11-28 17:02

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_rename_time_12hrs_price_cottage_time_6pm_6am_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payroll',
            name='employee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.employee'),
        ),
        migrations.AlterField(
            model_name='payroll',
            name='status',
            field=models.CharField(default='Not yet', max_length=50),
        ),
        migrations.AlterUniqueTogether(
            name='payroll',
            unique_together={('employee', 'status')},
        ),
    ]
