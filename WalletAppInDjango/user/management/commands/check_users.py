from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Check existing users and their superuser status'

    def handle(self, *args, **options):
        users = User.objects.all()
        
        if not users.exists():
            self.stdout.write('No users found in database')
            return
            
        self.stdout.write(f'Found {users.count()} user(s):')
        self.stdout.write('-' * 50)
        
        for user in users:
            status = []
            if user.is_superuser:
                status.append('SUPERUSER')
            if user.is_staff:
                status.append('STAFF')
            if user.is_active:
                status.append('ACTIVE')
            else:
                status.append('INACTIVE')
                
            self.stdout.write(
                f'ID: {user.id}\n'
                f'Email: {user.email}\n'
                f'Username: {user.username}\n'
                f'Phone: {user.phone}\n'
                f'Status: {", ".join(status)}\n'
                f'Date Joined: {user.date_joined}\n'
                f'Last Login: {user.last_login}\n'
                f'-' * 30
            ) 