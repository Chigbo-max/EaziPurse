# pgAdmin Connection Troubleshooting Guide

## Error: [Errno 11001] getaddrinfo failed

This error occurs when pgAdmin cannot resolve the hostname from your Render database URL.

## Step-by-Step Troubleshooting

### 1. Verify Your Render Database is Running

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Check your PostgreSQL database service status**
3. **Ensure it shows "Live" status**

### 2. Get the Correct Connection Details

1. **In your Render dashboard**, go to your PostgreSQL database service
2. **Click on the database service**
3. **Go to "Connections" tab**
4. **Copy the "External Database URL"**

### 3. Test Connection with Python First

Run the connection test script:

```bash
# Set your DATABASE_URL
$env:DATABASE_URL = "your_render_database_url_here"

# Test the connection
python check_render_db_connection.py
```

### 4. Common Issues & Solutions

#### Issue 1: Database not accessible externally
**Solution**: 
- Check if your Render database is set to allow external connections
- Some Render databases require IP whitelisting

#### Issue 2: Incorrect hostname
**Solution**:
- Make sure you're using the "External Database URL" from Render
- The hostname should look like: `dpg-xxxxx-a.oregon-postgres.render.com`

#### Issue 3: Firewall blocking connection
**Solution**:
- Try connecting from a different network
- Check if your ISP is blocking the connection

#### Issue 4: Database credentials
**Solution**:
- Verify username and password from the Render dashboard
- Make sure the database name is correct

### 5. Alternative Connection Methods

#### Method 1: Use psql command line
```bash
# Install psql if you don't have it
# Then connect using:
psql "your_render_database_url_here"
```

#### Method 2: Use Python script for inspection
```bash
python connect_to_render_db.py
```

#### Method 3: Use Render's built-in database viewer
1. Go to your Render database service
2. Click on "Connect" 
3. Use the built-in database viewer

### 6. pgAdmin Connection Settings

When setting up pgAdmin, use these exact settings:

**General Tab:**
- Name: `EaziPurse Render DB`

**Connection Tab:**
- Host name/address: `[hostname from DATABASE_URL]`
- Port: `[port from DATABASE_URL]` (usually 5432)
- Maintenance database: `[database_name from DATABASE_URL]`
- Username: `[username from DATABASE_URL]`
- Password: `[password from DATABASE_URL]`

**SSL Tab:**
- SSL Mode: `Require` or `Prefer`

### 7. Test with a Simple Connection

Try this simple test first:

```python
import psycopg2

# Replace with your actual connection details
conn = psycopg2.connect(
    host="your_host_here",
    port="5432",
    database="your_database_here",
    user="your_username_here",
    password="your_password_here"
)

print("Connection successful!")
conn.close()
```

### 8. If Still Having Issues

1. **Check Render database logs** for any connection errors
2. **Verify your database plan** allows external connections
3. **Contact Render support** if the database is not accessible
4. **Try connecting from a different network** (mobile hotspot, etc.)

## Quick Test Commands

```bash
# Test if hostname resolves
nslookup your_hostname_here

# Test if port is reachable
telnet your_hostname_here 5432

# Test with curl (if supported)
curl -v telnet://your_hostname_here:5432
``` 