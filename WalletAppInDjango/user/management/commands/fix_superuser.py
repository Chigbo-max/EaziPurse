from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model, authenticate
from django.db import transaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a superuser and test authentication'

    def handle(self, *args, **options):
        email = 'embracegod92@gmail.com'
        password = 'admin123'
        
        try:
            # Delete existing user if exists
            User.objects.filter(email=email).delete()
            self.stdout.write(f'Deleted existing user: {email}')
            
            # Create new superuser
            with transaction.atomic():
                user = User.objects.create_superuser(
                    email=email,
                    password=password,
                    username=email,
                    phone='08000000000'
                )
                
                self.stdout.write(self.style.SUCCESS(
                    f'Created superuser:\n'
                    f'Email: {user.email}\n'
                    f'Username: {user.username}\n'
                    f'Phone: {user.phone}\n'
                    f'Is Superuser: {user.is_superuser}\n'
                    f'Is Staff: {user.is_staff}\n'
                    f'Is Active: {user.is_active}\n'
                    f'Account Status: {user.account_status}'
                ))
            
            # Test authentication
            authenticated_user = authenticate(email=email, password=password)
            if authenticated_user:
                self.stdout.write(self.style.SUCCESS('✅ Authentication successful!'))
            else:
                self.stdout.write(self.style.ERROR('❌ Authentication failed!'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
            raise 