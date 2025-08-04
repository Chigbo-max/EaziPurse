#!/usr/bin/env python
"""
Test email template rendering without database connection
"""
import os
import sys
import django
from django.template.loader import render_to_string

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eaziPurse.settings')
django.setup()

def test_email_templates():
    """Test email template rendering"""
    print("Testing email template rendering...")
    
    # Test context
    context = {
        'user': type('User', (), {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        })(),
        'protocol': 'https',
        'domain': 'eazipurse-ng.onrender.com',
        'uid': 'test_uid_123',
        'token': 'test_token_456'
    }
    
    try:
        # Test HTML template
        html_content = render_to_string('email/password_reset_email.html', context)
        print("✅ HTML template rendered successfully")
        print(f"HTML length: {len(html_content)} characters")
        
        # Test text template
        text_content = render_to_string('email/password_reset_email.txt', context)
        print("✅ Text template rendered successfully")
        print(f"Text length: {len(text_content)} characters")
        
        # Check if reset URL is in the content
        reset_url = f"{context['protocol']}://{context['domain']}/reset-password?uid={context['uid']}&token={context['token']}"
        if reset_url in html_content:
            print("✅ Reset URL found in HTML template")
        else:
            print("❌ Reset URL not found in HTML template")
            
        if reset_url in text_content:
            print("✅ Reset URL found in text template")
        else:
            print("❌ Reset URL not found in text template")
            
        return True
        
    except Exception as e:
        print(f"❌ Template rendering failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_email_templates() 