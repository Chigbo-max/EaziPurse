from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

class Command(BaseCommand):
    help = 'Create a superuser with specific credentials'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, default='embracegod92@gmail.com')
        parser.add_argument('--password', type=str, default='admin123')
        parser.add_argument('--force', action='store_true', help='Force recreate superuser')

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']
        force = options['force']

        try:
            # Check if user exists
            user = User.objects.filter(email=email).first()
            
            if user:
                if force:
                    self.stdout.write(f'Deleting existing user: {email}')
                    user.delete()
                    user = None
                else:
                    self.stdout.write(f'User {email} already exists')
                    if user.is_superuser:
                        self.stdout.write(self.style.SUCCESS(f'Superuser {email} already exists'))
                        return
                    else:
                        self.stdout.write(f'Making {email} a superuser...')
                        user.is_superuser = True
                        user.is_staff = True
                        user.save()
                        self.stdout.write(self.style.SUCCESS(f'Made {email} a superuser'))
                        return

            # Create new superuser
            with transaction.atomic():
                superuser = User.objects.create_superuser(
                    email=email,
                    password=password,
                    username=email,  # Set username to email
                    phone='08000000000'  # Add required phone field
                )
                
                self.stdout.write(self.style.SUCCESS(
                    f'Successfully created superuser:\n'
                    f'Email: {email}\n'
                    f'Password: {password}\n'
                    f'Username: {email}'
                ))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating superuser: {str(e)}'))
            raise 