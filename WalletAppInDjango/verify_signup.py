import os
import sys
import random
import string
import django

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eaziPurse.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

email = f"testuser_{''.join(random.choices(string.digits, k=6))}@example.com"
phone = '080' + ''.join(random.choices('0123456789', k=8))
username = 'testuser' + ''.join(random.choices('0123456789', k=4))
print('Trying:', email, phone, username)
user = User.objects.create_user(
    email=email,
    password='Password123!',
    phone=phone,
    username=username,
    first_name='Test',
    last_name='User'
)
print('Created user:', user.id, user.email)
print('Profile exists:', hasattr(user, 'profile'))
print('Profile nin:', user.profile.nin, 'bvn:', user.profile.bvn)
