from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_handle_existing_empty_nin_bvn'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='nin',
            field=models.CharField(blank=True, max_length=11, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='bvn',
            field=models.CharField(blank=True, max_length=11, null=True),
        ),
    ]
