from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Fix usernames for existing users who have email as username'

    def handle(self, *args, **options):
        print("=" * 60)
        print("FIXING USERNAMES")
        print("=" * 60)
        
        # Find users whose username is their email
        users_to_fix = User.objects.filter(username__contains='@')
        
        if not users_to_fix.exists():
            print("✅ No users with email as username found")
            return
        
        print(f"Found {users_to_fix.count()} user(s) with email as username")
        print("-" * 50)
        
        updated_count = 0
        for user in users_to_fix:
            old_username = user.username
            new_username = None
            
            # Generate new username from first_name
            if user.first_name:
                base_username = user.first_name.lower().replace(' ', '')
                new_username = base_username
                counter = 1
                while User.objects.filter(username=new_username).exclude(pk=user.pk).exists():
                    new_username = f"{base_username}{counter}"
                    counter += 1
            else:
                # If no first_name, use email prefix
                email_prefix = user.email.split('@')[0]
                new_username = email_prefix
                counter = 1
                while User.objects.filter(username=new_username).exclude(pk=user.pk).exists():
                    new_username = f"{email_prefix}{counter}"
                    counter += 1
            
            # Update username
            user.username = new_username
            user.save()
            
            print(f"User: {user.email}")
            print(f"  Old username: {old_username}")
            print(f"  New username: {new_username}")
            print(f"  First name: {user.first_name}")
            print("-" * 30)
            
            updated_count += 1
        
        print(f"\n✅ Successfully updated {updated_count} user(s)")
        print("=" * 60) 