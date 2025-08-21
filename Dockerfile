# シンプルなNext.js用Dockerfile（Playwright無し版）
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000
ENV HOSTNAME=0.0.0.0

EXPOSE 10000

# Start the application
CMD ["npm", "start"]