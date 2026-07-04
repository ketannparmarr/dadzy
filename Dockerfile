# --- BUILD STAGE ---
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build production assets
COPY . .
RUN npm run build

# --- RUNNER STAGE ---
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm install --only=production

# Copy built frontend assets and Express server code
COPY --from=builder /app/dist ./dist
COPY server.js ./

# Set security context: run as non-root user
USER node

# Expose port
EXPOSE 3000

# Start Express server
CMD ["node", "server.js"]
