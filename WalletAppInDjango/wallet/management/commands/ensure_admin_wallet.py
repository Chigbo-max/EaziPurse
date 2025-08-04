from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from wallet.models import Wallet, Transaction
from decimal import Decimal
import random
import string

User = get_user_model()

class Command(BaseCommand):
    help = 'Ensure admin users have wallets and preserve existing data'

    def handle(self, *args, **options):
        self.stdout.write('Ensuring admin wallets are properly set up...')
        
        # Find admin users
        admin_users = User.objects.filter(is_superuser=True)
        
        for admin in admin_users:
            self.stdout.write(f'Processing admin: {admin.email} (ID: {admin.id})')
            
            # Check if admin has a wallet
            try:
                wallet = Wallet.objects.get(user=admin)
                self.stdout.write(f'  ✓ Wallet exists: {wallet.account_number} (Balance: ₦{wallet.balance})')
                
                # Check wallet transactions
                wallet_transactions = Transaction.objects.filter(
                    sender=admin
                ) | Transaction.objects.filter(
                    receiver=admin
                )
                self.stdout.write(f'  ✓ Transactions: {wallet_transactions.count()}')
                
            except Wallet.DoesNotExist:
                self.stdout.write(f'  ✗ No wallet found for admin {admin.email}')
                
                # Create wallet for admin
                try:
                    # Generate account number
                    if admin.phone and len(admin.phone) >= 11:
                        account_number = admin.phone[1:]
                    else:
                        account_number = '1' + str(admin.id).zfill(9)
                    
                    # Ensure uniqueness
                    counter = 1
                    original_account = account_number
                    while Wallet.objects.filter(account_number=account_number).exists():
                        account_number = f"{original_account}{counter}"
                        counter += 1
                    
                    wallet = Wallet.objects.create(
                        user=admin,
                        account_number=account_number,
                        balance=Decimal('0.00')
                    )
                    self.stdout.write(f'  ✓ Created wallet: {wallet.account_number}')
                except Exception as e:
                    self.stdout.write(f'  ✗ Error creating wallet: {e}')
            
            # Check for orphaned transactions (transactions without proper sender/receiver)
            orphaned_transactions = Transaction.objects.filter(
                sender__isnull=True
            ) | Transaction.objects.filter(
                receiver__isnull=True
            )
            
            if orphaned_transactions.exists():
                self.stdout.write(f'  ⚠️  Found {orphaned_transactions.count()} orphaned transactions')
                
                # Try to associate orphaned transactions with admin if they seem related
                for transaction in orphaned_transactions[:10]:  # Process first 10
                    if transaction.sender is None and transaction.receiver is None:
                        # This is a completely orphaned transaction
                        self.stdout.write(f'    - Orphaned transaction: {transaction.reference} (₦{transaction.amount})')
                    elif transaction.sender is None:
                        # Transaction with no sender but has receiver
                        self.stdout.write(f'    - Transaction missing sender: {transaction.reference} -> {transaction.receiver.email if transaction.receiver else "Unknown"}')
                    elif transaction.receiver is None:
                        # Transaction with no receiver but has sender
                        self.stdout.write(f'    - Transaction missing receiver: {transaction.reference} <- {transaction.sender.email if transaction.sender else "Unknown"}')
            
            # Check for duplicate references
            references = Transaction.objects.values_list('reference', flat=True)
            seen_refs = set()
            duplicate_refs = []
            
            for ref in references:
                if ref in seen_refs:
                    duplicate_refs.append(ref)
                seen_refs.add(ref)
            
            if duplicate_refs:
                self.stdout.write(f'  ⚠️  Found {len(duplicate_refs)} duplicate references')
                for ref in duplicate_refs[:5]:  # Show first 5
                    self.stdout.write(f'    - {ref}')
            else:
                self.stdout.write('  ✓ No duplicate references found')
        
        self.stdout.write('Admin wallet check completed!') 