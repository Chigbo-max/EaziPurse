from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from user.serializers import CustomUserCreateSerializer
from rest_framework import serializers

User = get_user_model()

class Command(BaseCommand):
    help = 'Test user creation to debug registration issues'

    def handle(self, *args, **options):
        print("=" * 60)
        print("TESTING USER CREATION")
        print("=" * 60)
        
        # Test data similar to what the frontend sends
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
        
        # Test serializer validation
        try:
            print("\n1. Testing serializer validation...")
            serializer = CustomUserCreateSerializer(data=test_data)
            
            if serializer.is_valid():
                print("✅ Serializer validation passed")
                print(f"Validated data: {serializer.validated_data}")
                
                # Test user creation
                print("\n2. Testing user creation...")
                user = serializer.save()
                print(f"✅ User created successfully!")
                print(f"User ID: {user.id}")
                print(f"Email: {user.email}")
                print(f"Username: {user.username}")
                print(f"Phone: {user.phone}")
                print(f"Is Active: {user.is_active}")
                print(f"Account Status: {user.account_status}")
                
                # Clean up - delete the test user
                user.delete()
                print("\n🧹 Test user deleted")
                
            else:
                print("❌ Serializer validation failed")
                print(f"Errors: {serializer.errors}")
                
        except Exception as e:
            print(f"❌ Error during testing: {e}")
            import traceback
            traceback.print_exc()
        
        print("\n" + "=" * 60) 