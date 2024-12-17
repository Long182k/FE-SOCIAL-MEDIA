# Use Node.js v20.15.0 as the base image
FROM node:20.15.0-alpine

# Install necessary build dependencies
RUN apk add --no-cache libc6-compat

# Install pnpm globally with specific version
RUN npm install -g pnpm@9.15.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Install serve to serve the static files
RUN npm install -g serve

# Expose the port (will be overridden by Railway's PORT env var)
EXPOSE ${PORT:-3000}

# Start command using environment variable PORT with fallback to 3000
CMD serve -s dist -p ${PORT:-3000} 