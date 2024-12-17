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

# Create a startup script in the working directory
COPY <<'EOF' /app/start.sh
#!/bin/sh
PORT="${PORT:-3000}"
exec http-server dist -p "$PORT"
EOF

# Make the script executable
RUN chmod +x /app/start.sh

# Expose default port
EXPOSE 3000

# Start command
CMD ["/app/start.sh"]