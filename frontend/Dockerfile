# Stage 1: Build
FROM node:20-alpine as build-stage
WORKDIR /app

# Enable high memory limit for Node.js build process
ENV NODE_OPTIONS="--max-old-space-size=1024"

COPY package*.json ./
# Use clean install for stability
RUN npm ci

COPY . .

# Run build
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
