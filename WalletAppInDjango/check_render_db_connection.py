#!/usr/bin/env python3
"""
Script to test Render database connection and show connection details
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

import dj_database_url
from django.db import connection

def test_database_connection():
    """Test database connection and show details"""
    print("=" * 60)
    print("RENDER DATABASE CONNECTION TEST")
    print("=" * 60)
    
    # Get DATABASE_URL
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL environment variable not set!")
        print("\nTo set it, run:")
        print("$env:DATABASE_URL = 'your_render_database_url_here'")
        return
    
    print(f"Database URL: {database_url}")
    
    # Parse the URL to show connection details
    try:
        from urllib.parse import urlparse
        parsed = urlparse(database_url)
        
        print(f"\nConnection Details:")
        print(f"Host: {parsed.hostname}")
        print(f"Port: {parsed.port}")
        print(f"Database: {parsed.path[1:]}")  # Remove leading slash
        print(f"Username: {parsed.username}")
        print(f"Password: {'*' * len(parsed.password) if parsed.password else 'None'}")
        
    except Exception as e:
        print(f"Error parsing URL: {e}")
    
    # Test the connection
    try:
        print(f"\nTesting connection...")
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ Connection successful!")
            print(f"PostgreSQL version: {version[0]}")
            
            # Test if we can query the user table
            cursor.execute("SELECT COUNT(*) FROM user_user;")
            user_count = cursor.fetchone()
            print(f"Number of users in database: {user_count[0]}")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\nPossible solutions:")
        print("1. Check if your Render database is running")
        print("2. Verify the DATABASE_URL is correct")
        print("3. Make sure your database allows external connections")
        print("4. Check if your IP is whitelisted (if required)")

if __name__ == "__main__":
    test_database_connection() 