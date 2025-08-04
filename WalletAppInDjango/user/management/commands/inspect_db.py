from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from wallet.models import Wallet

User = get_user_model()

class Command(BaseCommand):
    help = 'Inspect database and show all users and their details'

    def handle(self, *args, **options):
        self.stdout.write('=' * 60)
        self.stdout.write('DATABASE INSPECTION')
        self.stdout.write('=' * 60)
        
        # Check all users
        users = User.objects.all()
        self.stdout.write(f'\nFound {users.count()} user(s) in database:')
        self.stdout.write('-' * 50)
        
        for user in users:
            self.stdout.write(f'\nUser ID: {user.id}')
            self.stdout.write(f'Email: {user.email}')
            self.stdout.write(f'Username: {user.username}')
            self.stdout.write(f'Phone: {user.phone}')
            self.stdout.write(f'First Name: {user.first_name}')
            self.stdout.write(f'Last Name: {user.last_name}')
            self.stdout.write(f'Is Active: {user.is_active}')
            self.stdout.write(f'Is Staff: {user.is_staff}')
            self.stdout.write(f'Is Superuser: {user.is_superuser}')
            self.stdout.write(f'Account Status: {user.account_status}')
            self.stdout.write(f'Date Joined: {user.date_joined}')
            self.stdout.write(f'Last Login: {user.last_login}')
            
            # Check if user has a wallet
            try:
                wallet = Wallet.objects.get(user=user)
                self.stdout.write(f'Wallet Account Number: {wallet.account_number}')
                self.stdout.write(f'Wallet Balance: {wallet.balance}')
            except Wallet.DoesNotExist:
                self.stdout.write('Wallet: NOT FOUND')
            
            self.stdout.write('-' * 30)
        
        # Check for specific email
        target_email = 'embracegod92@gmail.com'
        try:
            target_user = User.objects.get(email=target_email)
            self.stdout.write(f'\n✅ Found target user: {target_email}')
            self.stdout.write(f'   Is Active: {target_user.is_active}')
            self.stdout.write(f'   Is Superuser: {target_user.is_superuser}')
            self.stdout.write(f'   Is Staff: {target_user.is_staff}')
        except User.DoesNotExist:
            self.stdout.write(f'\n❌ Target user not found: {target_email}')
        
        self.stdout.write('\n' + '=' * 60) 