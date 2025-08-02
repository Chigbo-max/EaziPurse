# Multi-stage build for full application

# Stage 1: Build Frontend
FROM node:20 AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY eazi-purse-frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY eazi-purse-frontend/ .

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM python:3.11-slim AS backend-builder

WORKDIR /app/backend

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        postgresql-client \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install pipenv
RUN pip install --no-cache-dir pipenv

# Copy backend Pipfile and Pipfile.lock
COPY WalletAppInDjango/Pipfile WalletAppInDjango/Pipfile.lock ./

# Install Python dependencies
RUN pipenv install --system --deploy

# Copy backend project
COPY WalletAppInDjango/ .

# Collect static files
RUN python manage.py collectstatic --noinput

# Stage 3: Production Image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        libpq-dev \
        nginx \
        nodejs \
        npm \
    && rm -rf /var/lib/apt/lists/*

# Copy backend from builder
COPY --from=backend-builder /app/backend /app/backend

# Copy frontend build from builder
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Install serve for frontend
RUN npm install -g serve

# Create nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    location / { \
        root /app/frontend/dist; \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location /api/ { \
        proxy_pass http://localhost:8000; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/sites-available/default

# Create startup script
RUN echo '#!/bin/bash \n\
# Start Django backend \n\
cd /app/backend \n\
python manage.py migrate \n\
python manage.py runserver 0.0.0.0:8000 & \n\
\n\
# Start nginx \n\
nginx -g "daemon off;"' > /app/start.sh

RUN chmod +x /app/start.sh

# Expose port 80
EXPOSE 80

# Start the application
CMD ["/app/start.sh"]
