# Generated by Django 5.2.1 on 2025-05-12 09:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='loanrequest',
            name='dependents',
            field=models.CharField(choices=[('0', '0'), ('1', '1'), ('2', '2'), ('3+', '3 or more')], max_length=10),
        ),
    ]
