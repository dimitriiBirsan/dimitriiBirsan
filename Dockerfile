# ----------------------------------------
# Stage 1: Build the Astro static site
# ----------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies based on package-lock.json
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ----------------------------------------
# Stage 2: Serve static files with Nginx
# ----------------------------------------
FROM nginx:alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static output from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
