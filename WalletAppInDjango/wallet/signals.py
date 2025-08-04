from django.db.models.signals import post_save
from .models import Wallet
from django.conf import settings
from django.dispatch import receiver


import random
import string

@receiver(post_save,sender=settings.AUTH_USER_MODEL)
def create_wallet(sender, instance, created, **kwargs):
    if created:
        # Generate account number from phone number (remove first digit)
        def generate_account_number_from_phone():
            if instance.phone and len(instance.phone) >= 11:
                # Remove the first digit (0) from phone number
                account_number = instance.phone[1:]
                
                # Check if it's unique, if not, add a random suffix
                if not Wallet.objects.filter(account_number=account_number).exists():
                    return account_number
                else:
                    # If not unique, add a random 2-digit suffix
                    suffix = ''.join(random.choices(string.digits, k=2))
                    return f"{account_number}{suffix}"
            else:
                # Fallback: generate random 10-digit number if phone is invalid
                while True:
                    account_number = '1' + ''.join(random.choices(string.digits, k=9))
                    if not Wallet.objects.filter(account_number=account_number).exists():
                        return account_number
        
        Wallet.objects.create(
            user=instance,
            account_number=generate_account_number_from_phone()
        )