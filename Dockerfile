# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Install dependencies for sharp
RUN apk add --no-cache \
    libc6-compat \
    vips-dev \
    fftw-dev \
    build-base \
    python3 \
    --virtual .build-deps

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Remove build dependencies
RUN apk del .build-deps

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]

