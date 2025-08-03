from django.core.management.base import BaseCommand
from wallet.models import Wallet
import random
import string


class Command(BaseCommand):
    help = 'Generate account numbers for existing wallets that have N/A'

    def handle(self, *args, **options):
        def generate_account_number():
            while True:
                account_number = '1' + ''.join(random.choices(string.digits, k=9))
                if not Wallet.objects.filter(account_number=account_number).exists():
                    return account_number

        # Find wallets with N/A account numbers
        wallets_with_na = Wallet.objects.filter(account_number='N/A')
        
        if not wallets_with_na.exists():
            self.stdout.write(
                self.style.SUCCESS('No wallets with N/A account numbers found.')
            )
            return

        updated_count = 0
        for wallet in wallets_with_na:
            wallet.account_number = generate_account_number()
            wallet.save()
            updated_count += 1
            self.stdout.write(
                f'Updated wallet for user {wallet.user.email}: {wallet.account_number}'
            )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} wallet(s).')
        ) 