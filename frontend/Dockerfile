# Stage 1: Build the Svelte application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build the app
COPY . .
RUN npm run build

# Stage 2: Create a lightweight production image
FROM nginx:alpine

# Configure NGINX for Svelte routing
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built app from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
