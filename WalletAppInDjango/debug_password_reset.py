#!/usr/bin/env python
"""
Debug password reset functionality
"""
import os
import sys
import django
from django.core.mail import send_mail
from django.conf import settings

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eaziPurse.settings')
django.setup()

def test_email_sending():
    """Test basic email sending"""
    print("Testing email configuration...")
    print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
    print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
    
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
            recipient_list=['embracegod92@gmail.com'],
            fail_silently=False,
        )
        
        print("✅ Test email sent successfully")
        
    except Exception as e:
        print(f"❌ Email test failed: {str(e)}")
        import traceback
        traceback.print_exc()

def test_djoser_password_reset():
    """Test Djoser password reset"""
    print("\nTesting Djoser password reset...")
    
    try:
        from djoser.email import PasswordResetEmail
        from django.contrib.auth import get_user_model
        
        User = get_user_model()
        
        # Find a test user
        user = User.objects.filter(email='embracegod92@gmail.com').first()
        if not user:
            print("❌ Test user not found")
            return
        
        print(f"Found user: {user.email}")
        
        # Test Djoser email
        context = {
            'user': user,
            'domain': 'eazipurse-ng.onrender.com',
            'protocol': 'https',
            'uid': 'test_uid',
            'token': 'test_token'
        }
        
        email = PasswordResetEmail(context)
        email.send([user.email])
        
        print("✅ Djoser password reset email sent successfully")
        
    except Exception as e:
        print(f"❌ Djoser password reset test failed: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_email_sending()
    test_djoser_password_reset() 