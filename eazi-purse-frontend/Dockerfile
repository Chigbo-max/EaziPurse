FROM node:20

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

COPY . .

# Build the application
RUN npm run build

# Install serve to run the built app
RUN npm install -g serve

# Remove dev dependencies to reduce image size
RUN npm prune --production

EXPOSE 5173

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]
