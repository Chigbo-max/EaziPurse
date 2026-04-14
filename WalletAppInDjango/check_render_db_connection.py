#!/usr/bin/env python3
"""
Script to test MongoDB Atlas connection and show connection details
"""
import os
from pymongo import MongoClient

def test_database_connection():
    """Test MongoDB Atlas connection and show details"""
    print("=" * 60)
    print("DATABASE CONNECTION TEST")
    print("=" * 60)
    
    mongo_uri = os.getenv('MONGO_URI') or os.getenv('DATABASE_URL')
    if not mongo_uri:
        print("❌ MONGO_URI environment variable not set!")
        print("\nTo set it, run:")
        print("$env:MONGO_URI = 'your_mongodb_atlas_connection_string'")
        return
    
    print(f"MongoDB URI: {mongo_uri}")
    
    try:
        print(f"\nTesting connection...")
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print(f"✅ Connection successful!")
        print(f"Databases: {client.list_database_names()}")
        client.close()
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("\nPossible solutions:")
        print("1. Check if your MongoDB Atlas cluster is running")
        print("2. Verify the MONGO_URI is correct")
        print("3. Make sure your Atlas network access allows your IP")
        print("4. Ensure dns resolution for mongodb+srv URIs works")

if __name__ == "__main__":
    test_database_connection() 