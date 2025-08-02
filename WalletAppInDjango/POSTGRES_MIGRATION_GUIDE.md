# PostgreSQL Migration Guide for EaziPurse

## Overview
This guide will help you migrate your Django EaziPurse application from MySQL to PostgreSQL.

## Prerequisites
1. PostgreSQL installed on your system
2. Python environment with Django
3. Access to your current MySQL database

## Step 1: Install PostgreSQL Dependencies

```bash
# Install psycopg2 (PostgreSQL adapter for Python)
pip install psycopg2-binary

# Or if using pipenv
pipenv install psycopg2-binary
```

## Step 2: Set Up PostgreSQL Database

```bash
# Create PostgreSQL database
createdb eazipurse_db

# Or using psql
psql -U postgres
CREATE DATABASE eazipurse_db;
\q
```

## Step 3: Update Environment Variables

Create or update your `.env` file with PostgreSQL credentials:

```env
# PostgreSQL Configuration
DB_NAME=eazipurse_db
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432

# Keep your existing environment variables
PAYSTACK_KEY=your_paystack_key
PAYSTACK_SECRET_KEY=your_paystack_secret
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_HOST_USER=your_email_user
EMAIL_HOST_PASSWORD=your_email_password
```

## Step 4: Update Django Settings

Replace the `DATABASES` configuration in `eaziPurse/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv("DB_NAME", "eazipurse_db"),
        'USER': os.getenv("DB_USER", "postgres"),
        'PASSWORD': os.getenv("DB_PASSWORD", ""),
        'HOST': os.getenv("DB_HOST", "localhost"),
        'PORT': os.getenv("DB_PORT", "5432"),
        'OPTIONS': {
            'charset': 'utf8',
        },
    }
}
```

## Step 5: Run PostgreSQL Migration

### Option A: Using Django Migrations (Recommended)

```bash
# Activate your virtual environment
pipenv shell

# Run migrations to create tables
python manage.py migrate

# Create a superuser
python manage.py createsuperuser
```

### Option B: Using SQL File (Alternative)

If you prefer to use the SQL file directly:

```bash
# Connect to PostgreSQL and run the migration
psql -U your_postgres_user -d eazipurse_db -f postgres_migration.sql
```

## Step 6: Data Migration (If Needed)

If you have existing data in MySQL that you want to migrate:

### Export from MySQL
```bash
# Export data from MySQL
mysqldump -u your_mysql_user -p your_mysql_database > mysql_backup.sql
```

### Import to PostgreSQL
```bash
# Convert and import data (you may need to modify the SQL file)
psql -U your_postgres_user -d eazipurse_db -f converted_data.sql
```

## Step 7: Verify Migration

```bash
# Test the application
python manage.py runserver

# Check database connection
python manage.py dbshell
```

## Tables Created

The migration creates the following tables:

### Core Django Tables
- `django_migrations` - Migration tracking
- `django_content_type` - Content types
- `django_admin_log` - Admin logs

### Authentication Tables
- `auth_group` - User groups
- `auth_permission` - Permissions
- `auth_group_permissions` - Group permissions

### Custom User Tables
- `user_user` - Custom User model (extends AbstractUser)
- `user_user_groups` - User group relationships
- `user_user_user_permissions` - User permission relationships

### Application Tables
- `user_profile` - User profile information
- `wallet_wallet` - User wallets
- `wallet_transaction` - Transaction records

## Key Features of PostgreSQL Migration

### 1. Data Types
- `DECIMAL(10,2)` for monetary values (balance, amount)
- `VARCHAR` for strings with length limits
- `TIMESTAMP WITH TIME ZONE` for datetime fields
- `BOOLEAN` for boolean fields
- `TEXT` for unlimited text fields

### 2. Constraints
- `UNIQUE` constraints on email, phone, NIN, BVN, account_number, reference
- `CHECK` constraints for transaction types
- `FOREIGN KEY` constraints with CASCADE delete
- `NOT NULL` constraints where appropriate

### 3. Indexes
- Performance indexes on frequently queried fields
- Composite indexes for better query performance

### 4. Extensions
- UUID extension for PostgreSQL UUID support

## Troubleshooting

### Common Issues

1. **Connection Error**
   - Verify PostgreSQL is running
   - Check credentials in environment variables
   - Ensure database exists

2. **Permission Error**
   - Grant proper permissions to your PostgreSQL user
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE eazipurse_db TO your_user;
   ```

3. **Migration Error**
   - Delete migration files and recreate them
   ```bash
   python manage.py makemigrations --empty user
   python manage.py makemigrations --empty wallet
   python manage.py migrate
   ```

4. **Data Type Issues**
   - PostgreSQL is stricter with data types
   - Ensure all data matches the expected types

## Performance Considerations

1. **Connection Pooling**
   - Consider using connection pooling for production
   - Set appropriate `CONN_MAX_AGE`

2. **Indexes**
   - The migration includes performance indexes
   - Monitor query performance and add indexes as needed

3. **Backup Strategy**
   - Set up regular PostgreSQL backups
   - Use `pg_dump` for database backups

## Production Deployment

1. **Environment Variables**
   - Use secure environment variables in production
   - Never commit database credentials

2. **Database Optimization**
   - Configure PostgreSQL for your server resources
   - Monitor and tune performance

3. **Security**
   - Use strong passwords
   - Limit database access
   - Enable SSL connections

## Rollback Plan

If you need to rollback to MySQL:

1. Keep your original MySQL configuration
2. Export data from PostgreSQL
3. Import back to MySQL
4. Update settings to use MySQL engine

## Support

For issues with the migration:
1. Check PostgreSQL logs
2. Verify Django settings
3. Test database connection manually
4. Review migration errors in detail 