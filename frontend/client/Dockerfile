# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm config set registry https://registry.npmjs.org/ \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm install

# Copy all source code
COPY . .

# Build React production files
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy React build output to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Optional: copy custom Nginx config if needed
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
