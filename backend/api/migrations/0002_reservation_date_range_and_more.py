# Generated by Django 5.0.7 on 2024-12-19 04:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='date_range',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='date_of_reservation',
            field=models.DateField(blank=True, null=True),
        ),
    ]