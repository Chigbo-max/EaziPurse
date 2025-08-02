from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Make a user an admin'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email of the user to make admin')

    def handle(self, *args, **options):
        email = options['email']
        
        try:
            user = User.objects.get(email=email)
            user.is_staff = True
            user.is_superuser = True
            user.save()
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully made {email} an admin')
            )
            self.stdout.write(f'User ID: {user.id}')
            self.stdout.write(f'Is Staff: {user.is_staff}')
            self.stdout.write(f'Is Superuser: {user.is_superuser}')
            
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'User with email {email} does not exist')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error making user admin: {e}')
            ) 