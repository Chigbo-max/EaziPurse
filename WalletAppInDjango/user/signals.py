from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in, user_login_failed
from django.contrib.auth import get_user_model
from .models import Profile, LoginHistory

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.profile.save()
    except Profile.DoesNotExist:
        Profile.objects.create(user=instance)

@receiver(user_logged_in)
def log_successful_login(sender, request, user, **kwargs):
    """Log successful login attempts"""
    try:
        print(f"Logging successful login for user: {user.email}")
        LoginHistory.objects.create(
            user=user,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            success=True
        )
        print(f"Successfully logged login for user: {user.email}")
    except Exception as e:
        print(f"Error logging successful login: {e}")

@receiver(user_login_failed)
def log_failed_login(sender, request, credentials, **kwargs):
    """Log failed login attempts"""
    try:
        # Try to get user by email from credentials
        email = credentials.get('email')
        if email:
            user = User.objects.get(email=email)
            LoginHistory.objects.create(
                user=user,
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                success=False
            )
    except User.DoesNotExist:
        # User doesn't exist, so we can't log it to a specific user
        pass
    except Exception as e:
        # Log any other errors but don't break the login process
        print(f"Error logging failed login: {e}")

def get_client_ip(request):
    """Get the client's IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip 