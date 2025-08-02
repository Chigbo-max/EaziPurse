-- PostgreSQL Migration for EaziPurse Django Application

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Django's built-in tables
CREATE TABLE IF NOT EXISTS django_migrations (
    id SERIAL PRIMARY KEY,
    app VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    applied TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS django_content_type (
    id SERIAL PRIMARY KEY,
    app_label VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    UNIQUE(app_label, model)
);

CREATE TABLE IF NOT EXISTS django_admin_log (
    id SERIAL PRIMARY KEY,
    action_time TIMESTAMP WITH TIME ZONE NOT NULL,
    object_id TEXT,
    object_repr VARCHAR(200) NOT NULL,
    action_flag SMALLINT NOT NULL,
    change_message TEXT NOT NULL,
    content_type_id INTEGER REFERENCES django_content_type(id),
    user_id INTEGER
);

-- Auth tables (inherited from AbstractUser)
CREATE TABLE IF NOT EXISTS auth_group (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS auth_permission (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content_type_id INTEGER NOT NULL REFERENCES django_content_type(id),
    codename VARCHAR(100) NOT NULL,
    UNIQUE(content_type_id, codename)
);

CREATE TABLE IF NOT EXISTS auth_group_permissions (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES auth_group(id),
    permission_id INTEGER NOT NULL REFERENCES auth_permission(id),
    UNIQUE(group_id, permission_id)
);

-- Custom User model (extends AbstractUser)
CREATE TABLE IF NOT EXISTS user_user (
    id SERIAL PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(254) NOT NULL UNIQUE,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    phone VARCHAR(11) NOT NULL UNIQUE
);

-- User permissions and groups
CREATE TABLE IF NOT EXISTS user_user_groups (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_user(id),
    group_id INTEGER NOT NULL REFERENCES auth_group(id),
    UNIQUE(user_id, group_id)
);

CREATE TABLE IF NOT EXISTS user_user_user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_user(id),
    permission_id INTEGER NOT NULL REFERENCES auth_permission(id),
    UNIQUE(user_id, permission_id)
);

-- User Profile model
CREATE TABLE IF NOT EXISTS user_profile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES user_user(id) ON DELETE CASCADE,
    image VARCHAR(100),
    address TEXT,
    nin VARCHAR(11) NOT NULL UNIQUE,
    bvn VARCHAR(11) NOT NULL UNIQUE
);

-- Wallet model
CREATE TABLE IF NOT EXISTS wallet_wallet (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES user_user(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    account_number VARCHAR(10) NOT NULL UNIQUE
);

-- Transaction model
CREATE TABLE IF NOT EXISTS wallet_transaction (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(40) NOT NULL UNIQUE,
    transaction_type VARCHAR(1) NOT NULL DEFAULT 'D',
    amount DECIMAL(10,2) NOT NULL,
    transaction_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    sender_id INTEGER REFERENCES user_user(id) ON DELETE CASCADE,
    receiver_id INTEGER REFERENCES user_user(id) ON DELETE CASCADE,
    CONSTRAINT check_transaction_type CHECK (transaction_type IN ('D', 'W', 'T', 'B')),
    CONSTRAINT check_sender_receiver CHECK (sender_id IS NOT NULL OR receiver_id IS NOT NULL)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_user_email ON user_user(email);
CREATE INDEX IF NOT EXISTS idx_user_user_phone ON user_user(phone);
CREATE INDEX IF NOT EXISTS idx_user_profile_nin ON user_profile(nin);
CREATE INDEX IF NOT EXISTS idx_user_profile_bvn ON user_profile(bvn);
CREATE INDEX IF NOT EXISTS idx_wallet_wallet_account_number ON wallet_wallet(account_number);
CREATE INDEX IF NOT EXISTS idx_wallet_transaction_reference ON wallet_transaction(reference);
CREATE INDEX IF NOT EXISTS idx_wallet_transaction_sender ON wallet_transaction(sender_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transaction_receiver ON wallet_transaction(receiver_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transaction_time ON wallet_transaction(transaction_time);

-- Insert initial content types for the models
INSERT INTO django_content_type (app_label, model) VALUES
    ('user', 'user'),
    ('user', 'profile'),
    ('wallet', 'wallet'),
    ('wallet', 'transaction')
ON CONFLICT DO NOTHING;

-- Insert initial permissions
INSERT INTO auth_permission (name, content_type_id, codename) 
SELECT 
    'Can add ' || model, 
    id, 
    'add_' || model
FROM django_content_type 
WHERE app_label IN ('user', 'wallet')
ON CONFLICT DO NOTHING;

INSERT INTO auth_permission (name, content_type_id, codename) 
SELECT 
    'Can change ' || model, 
    id, 
    'change_' || model
FROM django_content_type 
WHERE app_label IN ('user', 'wallet')
ON CONFLICT DO NOTHING;

INSERT INTO auth_permission (name, content_type_id, codename) 
SELECT 
    'Can delete ' || model, 
    id, 
    'delete_' || model
FROM django_content_type 
WHERE app_label IN ('user', 'wallet')
ON CONFLICT DO NOTHING;

INSERT INTO auth_permission (name, content_type_id, codename) 
SELECT 
    'Can view ' || model, 
    id, 
    'view_' || model
FROM django_content_type 
WHERE app_label IN ('user', 'wallet')
ON CONFLICT DO NOTHING;



COMMENT ON TABLE user_user IS 'Custom User model extending AbstractUser';
COMMENT ON TABLE user_profile IS 'User profile information';
COMMENT ON TABLE wallet_wallet IS 'User wallet with balance and account number';
COMMENT ON TABLE wallet_transaction IS 'Transaction records for deposits, withdrawals, transfers, and balance checks';

COMMENT ON COLUMN wallet_transaction.transaction_type IS 'D=Deposit, W=Withdraw, T=Transfer, B=Balance';
COMMENT ON COLUMN wallet_transaction.reference IS 'Unique transaction reference';
COMMENT ON COLUMN wallet_transaction.verified IS 'Whether the transaction has been verified'; 