# Multi-stage build for full application

# Stage 1: Build Frontend
FROM node:20 AS frontend-builder

WORKDIR /app/frontend

# Copy package files first for better caching
COPY eazi-purse-frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY eazi-purse-frontend/ .

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM python:3.11-slim AS backend-builder

WORKDIR /app/backend

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install pipenv
RUN pip install --no-cache-dir pipenv

# Copy dependency files first for better caching
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
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=eaziPurse.settings

WORKDIR /app

# Install only runtime dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq5 \
        nodejs \
        npm \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g serve

# Copy from builders
COPY --from=backend-builder /app/backend /app/backend
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Create startup script
RUN echo '#!/bin/bash \n\
cd /app/backend \n\
python manage.py migrate \n\
python manage.py runserver 0.0.0.0:8000 & \n\
cd /app/frontend \n\
serve -s dist -l 5173' > /app/start.sh \
    && chmod +x /app/start.sh

# Expose ports
EXPOSE 8000 5173

# Start the application
CMD ["/app/start.sh"]
