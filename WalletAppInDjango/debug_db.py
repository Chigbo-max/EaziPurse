#!/usr/bin/env python
import os
import sys
import django
from pymongo import MongoClient

# Add the project directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eaziPurse.settings')
django.setup()

from django.db import connection
from django.conf import settings

def debug_database():
    print("=== Database Debug Information ===")
    
    mongo_uri = os.getenv('MONGO_URI') or os.getenv('DATABASE_URL')
    print(f"MONGO_URI: {'SET' if mongo_uri else 'NOT SET'}")
    print(f"SECRET_KEY: {'SET' if os.getenv('SECRET_KEY') else 'NOT SET'}")
    print(f"DEBUG: {os.getenv('DEBUG', 'Not set')}")
    print(f"ALLOWED_HOSTS: {os.getenv('ALLOWED_HOSTS', 'Not set')}")
    
    # Check database configuration
    print(f"\nDatabase Engine: {settings.DATABASES['default']['ENGINE']}")
    print(f"Database Name: {settings.DATABASES['default'].get('NAME', 'Not set')}")
    print(f"Database Host: {settings.DATABASES['default'].get('HOST', 'Not set')}")
    print(f"Database Port: {settings.DATABASES['default'].get('PORT', 'Not set')}")
    
    if mongo_uri and mongo_uri.startswith('mongodb'):
        try:
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
            client.admin.command('ping')
            print(f"\n✅ MongoDB connection successful!")
            print(f"Databases: {client.list_database_names()}")
            client.close()
        except Exception as e:
            print(f"\n❌ MongoDB connection failed: {e}")
    else:
        # Test database connection
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()
                print(f"\n✅ Database connection successful!")
                print(f"Database version: {version[0] if version else 'Unknown'}")
        except Exception as e:
            print(f"\n❌ Database connection failed: {e}")
        
        # Check if tables exist
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    ORDER BY table_name;
                """)
                tables = cursor.fetchall()
                print(f"\n📋 Existing tables: {[table[0] for table in tables]}")
        except Exception as e:
            print(f"\n❌ Could not check tables: {e}")

if __name__ == "__main__":
    debug_database() 