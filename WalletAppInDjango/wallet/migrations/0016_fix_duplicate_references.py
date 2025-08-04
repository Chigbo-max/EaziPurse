from django.db import migrations
from uuid import uuid4

def fix_duplicate_references(apps, schema_editor):
    Transaction = apps.get_model('wallet', 'Transaction')
    
    # Get all transactions with duplicate references
    references = Transaction.objects.values_list('reference', flat=True)
    seen_refs = set()
    duplicate_refs = []
    
    for ref in references:
        if ref in seen_refs:
            duplicate_refs.append(ref)
        seen_refs.add(ref)
    
    # Fix duplicate references
    for ref in duplicate_refs:
        transactions = Transaction.objects.filter(reference=ref)
        # Keep the first one, update the rest
        for i, transaction in enumerate(transactions[1:], 1):
            new_ref = f'ref_{uuid4()}'
            transaction.reference = new_ref
            transaction.save()

def reverse_fix_duplicate_references(apps, schema_editor):
    # No reverse operation needed
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('wallet', '0015_fix_transaction_reference'),
    ]

    operations = [
        migrations.RunPython(fix_duplicate_references, reverse_fix_duplicate_references),
    ] 