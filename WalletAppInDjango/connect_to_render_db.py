#!/usr/bin/env python3
"""
Script to connect to Render database and inspect users
"""
import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
project_dir = Path(__file__).parent
sys.path.insert(0, str(project_dir))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eaziPurse.settings')
django.setup()

from django.contrib.auth import get_user_model
from wallet.models import Wallet

User = get_user_model()

def inspect_database():
    """Inspect the database and show all users"""
    print("=" * 60)
    print("RENDER DATABASE INSPECTION")
    print("=" * 60)
    
    try:
        # Check all users
        users = User.objects.all()
        print(f"\nFound {users.count()} user(s) in database:")
        print("-" * 50)
        
        for user in users:
            print(f"\nUser ID: {user.id}")
            print(f"Email: {user.email}")
            print(f"Username: {user.username}")
            print(f"Phone: {user.phone}")
            print(f"First Name: {user.first_name}")
            print(f"Last Name: {user.last_name}")
            print(f"Is Active: {user.is_active}")
            print(f"Is Staff: {user.is_staff}")
            print(f"Is Superuser: {user.is_superuser}")
            print(f"Account Status: {user.account_status}")
            print(f"Date Joined: {user.date_joined}")
            print(f"Last Login: {user.last_login}")
            
            # Check if user has a wallet
            try:
                wallet = Wallet.objects.get(user=user)
                print(f"Wallet Account Number: {wallet.account_number}")
                print(f"Wallet Balance: {wallet.balance}")
            except Wallet.DoesNotExist:
                print("Wallet: NOT FOUND")
            
            print("-" * 30)
        
        # Check for specific email
        target_email = 'embracegod92@gmail.com'
        try:
            target_user = User.objects.get(email=target_email)
            print(f"\n✅ Found target user: {target_email}")
            print(f"   Is Active: {target_user.is_active}")
            print(f"   Is Superuser: {target_user.is_superuser}")
            print(f"   Is Staff: {target_user.is_staff}")
            print(f"   Account Status: {target_user.account_status}")
        except User.DoesNotExist:
            print(f"\n❌ Target user not found: {target_email}")
        
        print("\n" + "=" * 60)
        
    except Exception as e:
        print(f"Error connecting to database: {e}")
        print("\nMake sure you have set the MONGO_URI environment variable")
        print("You can get this from your Atlas dashboard")

if __name__ == "__main__":
    uri = os.getenv('MONGO_URI') or os.getenv('DATABASE_URL')
    if not uri:
        print("❌ MONGO_URI environment variable not set!")
        print("\nTo set it, run:")
        print("$env:MONGO_URI = 'your_mongodb_atlas_connection_string'")
        print("\nOr add it to your PowerShell profile")
        sys.exit(1)
    
    inspect_database() 