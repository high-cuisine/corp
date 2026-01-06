# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy built application from builder
# In standalone mode, Next.js creates a complete app with all dependencies
# The standalone directory contains server.js and node_modules
COPY --from=builder /app/.next/standalone ./
# Copy static files (they need to be in .next/static relative to server.js)
COPY --from=builder /app/.next/static ./.next/static
# Copy public files (they need to be in public relative to server.js)
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
# In standalone mode, server.js is in the root of standalone directory
CMD ["node", "server.js"]

