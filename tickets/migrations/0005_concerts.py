# Generated by Django 2.1.3 on 2018-11-28 22:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0004_auto_20181120_1926'),
    ]

    operations = [
        migrations.CreateModel(
            name='Concerts',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('location', models.CharField(max_length=100)),
                ('band', models.CharField(max_length=100)),
                ('price', models.IntegerField()),
                ('number_of_seats', models.IntegerField()),
            ],
        ),
    ]
