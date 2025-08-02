from django.core.management.base import BaseCommand
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Test authentication for debugging'

    def handle(self, *args, **options):
        # Create a test user if it doesn't exist
        user, created = User.objects.get_or_create(
            email='test@example.com',
            defaults={
                'username': 'test@example.com',
                'first_name': 'Test',
                'last_name': 'User',
                'phone': '08012345678',
                'is_active': True,
                'is_staff': True,
            }
        )
        
        if created:
            user.set_password('testpass123')
            user.save()
            self.stdout.write('Created test user')
        
        # Test authentication
        self.stdout.write('Testing authentication...')
        authenticated_user = authenticate(username='test@example.com', password='testpass123')
        
        if authenticated_user:
            self.stdout.write(
                self.style.SUCCESS('Authentication successful!')
            )
            self.stdout.write(f'User: {authenticated_user.email}')
            self.stdout.write(f'Active: {authenticated_user.is_active}')
        else:
            self.stdout.write(
                self.style.ERROR('Authentication failed!')
            )
        
        # List all users
        self.stdout.write('\nAll users in database:')
        for u in User.objects.all():
            self.stdout.write(f'- {u.email} (active: {u.is_active})') 