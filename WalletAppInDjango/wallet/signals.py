from django.db.models.signals import post_save
from .models import Wallet
from django.conf import settings
from django.dispatch import receiver


import random
import string

@receiver(post_save,sender=settings.AUTH_USER_MODEL)
def create_wallet(sender, instance, created, **kwargs):
    if created:
        print(f"Creating wallet for user: {instance.email}")
        
        # Check if wallet already exists (to prevent duplicates)
        if Wallet.objects.filter(user=instance).exists():
            print(f"Wallet already exists for user: {instance.email}")
            return
        
        # Generate account number from phone number (remove first digit)
        def generate_account_number_from_phone():
            if instance.phone and len(instance.phone) >= 11:
                # Remove the first digit (0) from phone number
                account_number = instance.phone[1:]
                print(f"Generated account number from phone: {account_number}")
                
                # Check if it's unique, if not, add a random suffix
                if not Wallet.objects.filter(account_number=account_number).exists():
                    return account_number
                else:
                    # If not unique, add a random 2-digit suffix
                    suffix = ''.join(random.choices(string.digits, k=2))
                    final_account = f"{account_number}{suffix}"
                    print(f"Account number with suffix: {final_account}")
                    return final_account
            else:
                # Fallback: generate random 10-digit number if phone is invalid
                while True:
                    account_number = '1' + ''.join(random.choices(string.digits, k=9))
                    if not Wallet.objects.filter(account_number=account_number).exists():
                        print(f"Generated random account number: {account_number}")
                        return account_number
        
        try:
            account_number = generate_account_number_from_phone()
            wallet = Wallet.objects.create(
                user=instance,
                account_number=account_number
            )
            print(f"Wallet created successfully: {wallet.account_number}")
        except Exception as e:
            print(f"Error creating wallet: {e}")
            import traceback
            traceback.print_exc()