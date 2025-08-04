from django.db import migrations

def handle_empty_nin_bvn(apps, schema_editor):
    Profile = apps.get_model('user', 'Profile')
    
    # Update profiles with empty NIN/BVN to use None instead of empty string
    Profile.objects.filter(nin='').update(nin=None)
    Profile.objects.filter(bvn='').update(bvn=None)

def reverse_handle_empty_nin_bvn(apps, schema_editor):
    Profile = apps.get_model('user', 'Profile')
    
    # Reverse: set None values back to empty string
    Profile.objects.filter(nin__isnull=True).update(nin='')
    Profile.objects.filter(bvn__isnull=True).update(bvn='')

class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_fix_profile_nin_bvn_constraints'),
    ]

    operations = [
        migrations.RunPython(handle_empty_nin_bvn, reverse_handle_empty_nin_bvn),
    ] 