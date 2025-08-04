from django.core.management.base import BaseCommand
from wallet.models import Wallet
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Test account number generation from phone numbers'

    def handle(self, *args, **options):
        print("=" * 60)
        print("TESTING ACCOUNT NUMBER GENERATION")
        print("=" * 60)
        
        # Test cases
        test_cases = [
            "09012345123",  
            "08064042241",  
            "07098765432",  
            "08123456789", 
        ]
        
        print("Testing account number generation logic:")
        for phone in test_cases:
            expected = phone[1:]  
            print(f"Phone: {phone} → Account: {expected}")
        
        print("\n" + "=" * 60)
        print("CURRENT WALLETS IN DATABASE:")
        print("=" * 60)
        
        wallets = Wallet.objects.all().select_related('user')
        
        if not wallets.exists():
            print("No wallets found in database")
            return
        
        for wallet in wallets:
            print(f"\nUser: {wallet.user.email}")
            print(f"Phone: {wallet.user.phone}")
            print(f"Current Account Number: {wallet.account_number}")
            
            if wallet.user.phone and len(wallet.user.phone) >= 11:
                expected_account = wallet.user.phone[1:]
                print(f"Expected Account (from phone): {expected_account}")
                
                if wallet.account_number == expected_account:
                    print("✅ Account number matches phone number")
                else:
                    print("❌ Account number does NOT match phone number")
            else:
                print("⚠️  User has no valid phone number")
            
            print("-" * 30)
        
        print("\n" + "=" * 60) 