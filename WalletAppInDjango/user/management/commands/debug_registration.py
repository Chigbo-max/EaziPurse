from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from user.serializers import CustomUserCreateSerializer
from rest_framework import serializers
import traceback

User = get_user_model()

class Command(BaseCommand):
    help = 'Debug user registration with exact payload'

    def handle(self, *args, **options):
        print("=" * 60)
        print("DEBUGGING USER REGISTRATION")
        print("=" * 60)
        
        # Exact payload from frontend
        test_data = {
            'username': 'Tester',
            'email': 'ezeokeke.chigbo@gmail.com',
            'password': 'passwordPASSWORD',
            're_password': 'passwordPASSWORD',
            'first_name': 'Tester',
            'last_name': 'Tester',
            'phone': '08064042241'
        }
        
        print(f"Test data: {test_data}")
        
        # Test 1: Check if user already exists
        print("\n1. Checking if user already exists...")
        existing_user = User.objects.filter(email=test_data['email']).first()
        if existing_user:
            print(f"❌ User already exists: {existing_user.email}")
            print(f"   Username: {existing_user.username}")
            print(f"   Phone: {existing_user.phone}")
            return
        
        existing_phone = User.objects.filter(phone=test_data['phone']).first()
        if existing_phone:
            print(f"❌ Phone number already exists: {existing_phone.phone}")
            print(f"   Email: {existing_phone.email}")
            return
        
        print("✅ No existing user found")
        
        # Test 2: Serializer validation
        print("\n2. Testing serializer validation...")
        try:
            serializer = CustomUserCreateSerializer(data=test_data)
            
            if serializer.is_valid():
                print("✅ Serializer validation passed")
                print(f"Validated data: {serializer.validated_data}")
                
                # Test 3: User creation
                print("\n3. Testing user creation...")
                try:
                    user = serializer.save()
                    print(f"✅ User created successfully!")
                    print(f"User ID: {user.id}")
                    print(f"Email: {user.email}")
                    print(f"Username: {user.username}")
                    print(f"Phone: {user.phone}")
                    print(f"First Name: {user.first_name}")
                    print(f"Last Name: {user.last_name}")
                    print(f"Is Active: {user.is_active}")
                    print(f"Account Status: {user.account_status}")
                    
                    # Check if wallet was created
                    try:
                        wallet = user.wallet
                        print(f"Wallet Account Number: {wallet.account_number}")
                        print(f"Wallet Balance: {wallet.balance}")
                    except:
                        print("❌ Wallet not created")
                    
                    # Clean up - delete the test user
                    user.delete()
                    print("\n🧹 Test user deleted")
                    
                except Exception as e:
                    print(f"❌ Error during user creation: {e}")
                    traceback.print_exc()
                    
            else:
                print("❌ Serializer validation failed")
                print(f"Errors: {serializer.errors}")
                
                # Check specific field errors
                for field, errors in serializer.errors.items():
                    print(f"  {field}: {errors}")
                    
        except Exception as e:
            print(f"❌ Error during testing: {e}")
            traceback.print_exc()
        
        print("\n" + "=" * 60) 