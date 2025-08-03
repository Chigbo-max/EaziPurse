#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eaziPurse.settings')
django.setup()

from django.db import connection
from django.conf import settings

def health_check():
    print("=== EaziPurse Health Check ===")
    
    # Check basic settings
    print(f"✅ Django version: {django.get_version()}")
    print(f"✅ DEBUG: {settings.DEBUG}")
    print(f"✅ ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    
    # Check database
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
            print("✅ Database connection: OK")
    except Exception as e:
        print(f"❌ Database connection: FAILED - {e}")
        return False
    
    # Check if migrations are applied
    try:
        from django.core.management import execute_from_command_line
        from io import StringIO
        from django.core.management.base import OutputWrapper
        
        # Check migration status
        from django.core.management.commands.showmigrations import Command as ShowMigrationsCommand
        command = ShowMigrationsCommand()
        command.stdout = StringIO()
        command.stderr = StringIO()
        command.handle()
        
        output = command.stdout.getvalue()
        if "X" in output:  # X indicates applied migrations
            print("✅ Migrations: Applied")
        else:
            print("⚠️  Migrations: Not applied")
            
    except Exception as e:
        print(f"❌ Migration check failed: {e}")
    
    # Check static files
    try:
        static_root = settings.STATIC_ROOT
        if os.path.exists(static_root):
            print("✅ Static files: Collected")
        else:
            print("⚠️  Static files: Not collected")
    except Exception as e:
        print(f"❌ Static files check failed: {e}")
    
    print("\n=== Health Check Complete ===")
    return True

if __name__ == "__main__":
    health_check() 