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
            # Check if superuser already exists
            existing_user = User.objects.filter(email=email).first()
            
            if existing_user:
                self.stdout.write(f'Superuser already exists: {email}')
                self.stdout.write(self.style.SUCCESS(
                    f'Existing superuser details:\n'
                    f'Email: {existing_user.email}\n'
                    f'Username: {existing_user.username}\n'
                    f'Phone: {existing_user.phone}\n'
                    f'Is Superuser: {existing_user.is_superuser}\n'
                    f'Is Staff: {existing_user.is_staff}\n'
                    f'Is Active: {existing_user.is_active}\n'
                    f'Account Status: {existing_user.account_status}\n'
                    f'User ID: {existing_user.id}'
                ))
                
                # Test authentication with existing user
                authenticated_user = authenticate(email=email, password=password)
                if authenticated_user:
                    self.stdout.write(self.style.SUCCESS('✅ Authentication successful with existing user!'))
                else:
                    self.stdout.write(self.style.WARNING('⚠️  Authentication failed with existing user. Password might be different.'))
                return
            
            # Create new superuser only if it doesn't exist
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