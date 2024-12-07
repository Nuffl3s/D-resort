# Generated by Django 5.0.7 on 2024-12-03 17:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_remove_cottage_time_24hrs_price_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomPrice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_range', models.CharField(max_length=50)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.RemoveField(
            model_name='cottage',
            name='image',
        ),
        migrations.AlterField(
            model_name='cottage',
            name='capacity',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='cottage',
            name='custom_prices',
            field=models.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name='cottage',
            name='name',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='cottage',
            name='type',
            field=models.CharField(max_length=50),
        ),
    ]
