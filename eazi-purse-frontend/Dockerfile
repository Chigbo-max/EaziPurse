FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

# Build the application
RUN npm run build

# Install serve to run the built app
RUN npm install -g serve

EXPOSE 5173

# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]
