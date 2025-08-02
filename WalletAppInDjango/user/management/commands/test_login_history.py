from django.core.management.base import BaseCommand
from user.models import User, LoginHistory
from django.utils import timezone

class Command(BaseCommand):
    help = 'Test login history creation'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='User email')

    def handle(self, *args, **options):
        email = options['email']
        
        try:
            user = User.objects.get(email=email)
            
            # Create a test login history entry
            LoginHistory.objects.create(
                user=user,
                ip_address='127.0.0.1',
                user_agent='Test Browser',
                success=True
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created login history for user: {email}')
            )
            
            # Show all login history for this user
            login_history = LoginHistory.objects.filter(user=user).order_by('-timestamp')
            self.stdout.write(f'Total login history entries: {login_history.count()}')
            
            for entry in login_history[:5]:  # Show last 5 entries
                self.stdout.write(
                    f'- {entry.timestamp}: {"Success" if entry.success else "Failed"} '
                    f'from {entry.ip_address}'
                )
                
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'User with email {email} does not exist')
            ) 