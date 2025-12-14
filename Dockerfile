# Build stage
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Install build deps (use package-lock if present for reproducible builds)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install only production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy built files
COPY --from=builder /usr/src/app/dist ./dist

# Copy .env example or needed static files if any (optional)
# COPY --from=builder /usr/src/app/.env .

EXPOSE 3000

# Start the app. Ensure this path matches your build output (dist/app.js)
CMD ["node", "dist/app.js"]
