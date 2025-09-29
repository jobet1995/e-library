# syntax = docker/dockerfile:1.4

# Stage 1: Base with Node.js
FROM node:20-alpine AS base

# Install dependencies required for building
RUN apk add --no-cache libc6-compat

# Stage 2: Dependencies
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with npm
RUN npm ci --prefer-offline --no-audit --progress=false

# Stage 3: Builder
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    NODE_OPTIONS='--max-old-space-size=4096'

# Set build time environment variables with defaults
ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the application
RUN --mount=type=cache,target=/app/.next/cache \
    --mount=type=cache,target=/root/.npm \
    npm run build

# Stage 4: Development
FROM base AS development
WORKDIR /app

# Copy package files and install dev dependencies
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

# Stage 5: Production
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Use non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set port
ENV PORT 3000

# Start the application
CMD ["node", "server.js"]
