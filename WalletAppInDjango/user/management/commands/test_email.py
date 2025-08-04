from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Test email functionality'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, help='Email address to send test email to')
        parser.add_argument('--test-password-reset', action='store_true', help='Test password reset email')

    def handle(self, *args, **options):
        test_email = options.get('email')
        test_password_reset = options.get('test_password_reset')
        
        if not test_email:
            self.stdout.write(self.style.ERROR('Please provide an email address with --email'))
            return
        
        self.stdout.write(f'Testing email configuration...')
        self.stdout.write(f'EMAIL_HOST: {settings.EMAIL_HOST}')
        self.stdout.write(f'EMAIL_PORT: {settings.EMAIL_PORT}')
        self.stdout.write(f'EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}')
        self.stdout.write(f'EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}')
        self.stdout.write(f'DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}')
        
        try:
            # Test basic email
            subject = 'Test Email from EaziPurse'
            message = f'''
            This is a test email from EaziPurse.
            
            Email Configuration:
            - Host: {settings.EMAIL_HOST}
            - Port: {settings.EMAIL_PORT}
            - User: {settings.EMAIL_HOST_USER}
            - TLS: {settings.EMAIL_USE_TLS}
            
            If you receive this email, the email configuration is working correctly.
            '''
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[test_email],
                fail_silently=False,
            )
            
            self.stdout.write(self.style.SUCCESS(f'✅ Test email sent successfully to {test_email}'))
            
            # Test password reset if requested
            if test_password_reset:
                self.stdout.write('Testing password reset email...')
                
                # Find or create a test user
                user, created = User.objects.get_or_create(
                    email=test_email,
                    defaults={
                        'username': test_email,
                        'first_name': 'Test',
                        'last_name': 'User',
                        'phone': '08000000000'
                    }
                )
                
                if created:
                    self.stdout.write(f'Created test user: {user.email}')
                else:
                    self.stdout.write(f'Using existing user: {user.email}')
                
                # Import and test password reset
                from djoser.email import PasswordResetEmail
                from djoser.conf import settings as djoser_settings
                
                context = {
                    'user': user,
                    'domain': 'eazipurse-ng.onrender.com',
                    'protocol': 'https',
                    'uid': 'test_uid',
                    'token': 'test_token'
                }
                
                email = PasswordResetEmail(context)
                email.send([test_email])
                
                self.stdout.write(self.style.SUCCESS(f'✅ Password reset email sent successfully to {test_email}'))
                
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Email test failed: {str(e)}'))
            import traceback
            traceback.print_exc() 