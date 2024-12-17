# Use Node.js v20.15.0 as the base image
FROM node:20.15.0-alpine

# Install necessary build dependencies
RUN apk add --no-cache libc6-compat

# Install pnpm globally with specific version
RUN npm install -g pnpm@9.15.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Clean install without frozen lockfile
RUN pnpm install --no-frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Install a lightweight HTTP server
RUN npm install -g http-server

# Create a startup script
RUN echo '#!/bin/sh\nhttp-server dist -p "${PORT:-3000}" --proxy http://localhost:"${PORT:-3000}"?' > start.sh && \
    chmod +x start.sh

# Expose default port
EXPOSE 3000

# Start command
CMD ["./start.sh"]