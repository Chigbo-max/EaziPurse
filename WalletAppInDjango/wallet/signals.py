from django.db.models.signals import post_save
from .models import Wallet
from django.conf import settings
from django.dispatch import receiver


import random
import string

@receiver(post_save,sender=settings.AUTH_USER_MODEL)
def create_wallet(sender, instance, created, **kwargs):
    if created:
        # Generate a unique 10-digit account number
        def generate_account_number():
            while True:
                # Generate a 10-digit number starting with 1
                account_number = '1' + ''.join(random.choices(string.digits, k=9))
                # Check if it's unique
                if not Wallet.objects.filter(account_number=account_number).exists():
                    return account_number
        
        Wallet.objects.create(
            user=instance,
            account_number=generate_account_number()
        )