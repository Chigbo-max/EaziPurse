import os
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv
from pymongo import MongoClient

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')
load_dotenv(BASE_DIR / '.env.development', override=True)

uri = os.getenv('MONGO_URI') or os.getenv('DATABASE_URL')
if not uri:
    raise SystemExit('MONGO_URI or DATABASE_URL must be set in .env or .env.development')

client = MongoClient(uri)

def get_database(client):
    from pymongo.errors import ConfigurationError

    try:
        db = client.get_default_database()
        if db is not None:
            return db
    except ConfigurationError:
        pass

    parsed = urlparse(uri)
    path = parsed.path.lstrip('/')
    if path:
        return client[path]

    db_name = os.getenv('MONGO_DB_NAME', 'eazipurse_db')
    return client[db_name]


db = get_database(client)
collection = db['user_profile']

print('Connected to MongoDB database:', db.name)
print('Inspecting indexes for collection: user_profile')

indexes = list(collection.list_indexes())
if not indexes:
    print('No indexes found on user_profile')
    raise SystemExit(0)

removed = []
for idx in indexes:
    key_dict = dict(idx['key'])
    if key_dict in ({'nin': 1}, {'bvn': 1}):
        print(f"Dropping index: {idx['name']} on fields {key_dict} (unique={idx.get('unique', False)})")
        collection.drop_index(idx['name'])
        removed.append(idx['name'])

if not removed:
    print('No matching nin/bvn unique indexes found to drop.')
else:
    print('Dropped indexes:', ', '.join(removed))

print('\nFinal index list:')
for idx in collection.list_indexes():
    print(f"- {idx['name']}: {dict(idx['key'])}, unique={idx.get('unique', False)}")
