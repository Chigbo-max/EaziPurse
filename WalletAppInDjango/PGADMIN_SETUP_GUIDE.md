# pgAdmin Setup Guide for Render Database

## Option 1: Download pgAdmin Desktop

1. **Download pgAdmin 4**: https://www.pgadmin.org/download/pgadmin-4-windows/
2. **Install pgAdmin** on your Windows machine
3. **Launch pgAdmin**

## Option 2: Use Docker (if Docker Desktop is running)

```bash
# Start pgAdmin container
docker run --name eazipurse_pgadmin \
  -e PGADMIN_DEFAULT_EMAIL=admin@eazipurse.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin123 \
  -p 5050:80 \
  -d dpage/pgadmin4:latest
```

Then access pgAdmin at: http://localhost:5050

## Getting Your Render Database Connection Details

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Navigate to your PostgreSQL database service**
3. **Click on the database service**
4. **Go to "Connections" tab**
5. **Copy the "External Database URL"**

The URL will look like:
```
postgresql://username:password@host:port/database_name
```

## Connecting pgAdmin to Render Database

1. **Open pgAdmin**
2. **Right-click on "Servers"** → **"Register"** → **"Server..."**
3. **General Tab:**
   - Name: `EaziPurse Render DB`
4. **Connection Tab:**
   - Host name/address: `[host from your DATABASE_URL]`
   - Port: `[port from your DATABASE_URL]`
   - Maintenance database: `[database_name from your DATABASE_URL]`
   - Username: `[username from your DATABASE_URL]`
   - Password: `[password from your DATABASE_URL]`
5. **Click "Save"**

## Inspecting Users Table

Once connected:

1. **Expand your server** → **Databases** → **[your_database]** → **Schemas** → **public** → **Tables**
2. **Right-click on "user_user" table** → **"View/Edit Data"** → **"All Rows"**
3. **This will show you all users in your database**

## Alternative: Use Python Script

If you prefer command line, you can use the provided script:

1. **Set your DATABASE_URL environment variable:**
   ```powershell
   $env:DATABASE_URL = "your_render_database_url_here"
   ```

2. **Run the inspection script:**
   ```bash
   python connect_to_render_db.py
   ```

## Database URL Format

Your Render database URL should look like:
```
postgresql://username:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/database_name
```

**Note**: Make sure to replace the actual values from your Render dashboard. 