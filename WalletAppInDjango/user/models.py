from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import FileExtensionValidator

from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        
        # Generate username from first_name if not provided
        username = extra_fields.get('username')
        if not username and extra_fields.get('first_name'):
            base_username = extra_fields.get('first_name').lower().replace(' ', '')
            username = base_username
            counter = 1
            while self.model.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            extra_fields['username'] = username
        
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('phone', '08000000000')  # Add default phone
        
        # Generate username from first_name or use 'admin'
        username = extra_fields.get('username')
        if not username:
            if extra_fields.get('first_name'):
                username = extra_fields.get('first_name').lower().replace(' ', '')
            else:
                username = 'admin'
        
        extra_fields.setdefault('username', username)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    phone = models.CharField(max_length=11, unique=True)
    email = models.EmailField(unique=True)
    
    ACCOUNT_STATUS_CHOICES = [
        ('active', 'Active'),
        ('pending', 'Pending'),
        ('suspended', 'Suspended'),
    ]
    
    account_status = models.CharField(
        max_length=10,
        choices=ACCOUNT_STATUS_CHOICES,
        default='active'
    )
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def save(self, *args, **kwargs):
        # Ensure username is set to first_name if not provided, fallback to email
        if not self.username:
            if self.first_name:
                # Use first_name as username, make it unique if needed
                base_username = self.first_name.lower().replace(' ', '')
                username = base_username
                counter = 1
                while User.objects.filter(username=username).exclude(pk=self.pk).exists():
                    username = f"{base_username}{counter}"
                    counter += 1
                self.username = username
            elif self.email:
                self.username = self.email
        super().save(*args, **kwargs)
    
    @property
    def can_operate(self):
        """Check if user can perform operations based on account status"""
        return self.account_status == 'active' and self.is_active


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="user/profile/image", null=True, blank=True, validators=[FileExtensionValidator(["jpg", "jpeg", "png"])])
    address = models.TextField(null=True, blank=True)
    nin = models.CharField(max_length=11, unique=True)
    bvn = models.CharField(max_length=11, unique=True)


class LoginHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_history')
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    success = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-timestamp']


class AdminSettings(models.Model):
    """Model to store system-wide admin settings"""
    # Notification settings
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    
    # Transaction settings
    transaction_limit = models.DecimalField(max_digits=12, decimal_places=2, default=1000000.00)
    
    # System settings (fixed values)
    currency = models.CharField(max_length=3, default='NGN')
    timezone = models.CharField(max_length=50, default='Africa/Lagos')
    
    # System information
    platform_version = models.CharField(max_length=20, default='v1.0.0')
    database = models.CharField(max_length=50, default='PostgreSQL')
    system_status = models.CharField(max_length=20, default='Healthy')
    uptime = models.CharField(max_length=20, default='99.9%')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        verbose_name = 'Admin Settings'
        verbose_name_plural = 'Admin Settings'
    
    def __str__(self):
        return f"System Settings (Updated: {self.updated_at.strftime('%Y-%m-%d %H:%M')})"
    
    @classmethod
    def get_settings(cls):
        """Get the current settings, create default if none exist"""
        settings, created = cls.objects.get_or_create(
            id=1,  # Always use ID 1 for system settings
            defaults={
                'email_notifications': True,
                'sms_notifications': False,
                'transaction_limit': 1000000.00,
                'currency': 'NGN',
                'timezone': 'Africa/Lagos',
                'platform_version': 'v1.0.0',
                'database': 'PostgreSQL',
                'system_status': 'Healthy',
                'uptime': '99.9%',
            }
        )
        return settings

