FROM node:20-alpine

# Install system dependencies for sharp
RUN apk add --no-cache \
    vips-dev \
    python3 \
    make \
    g++

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Make npm network-tolerant
RUN npm config set registry https://registry.npmjs.org/ \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm install

# Copy app source
COPY . .

EXPOSE 5000
CMD ["node", "index1.js"]
 