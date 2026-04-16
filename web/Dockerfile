# Stage 1 — build the Vite app
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Bake the backend URL into the JS bundle at build time.
# Pass --build-arg VITE_API_BASE_URL=https://... when building for production.
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2 — serve with nginx
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# nginx:alpine has built-in envsubst-on-templates support:
#   files in /etc/nginx/templates/*.template are processed at startup
#   and written to /etc/nginx/conf.d/ (stripping the .template suffix).
# This substitutes ${PORT} with Railway's injected $PORT value.
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Remove the default server config so it doesn't conflict with ours
RUN rm -f /etc/nginx/conf.d/default.conf

# Railway will inject $PORT; default to 80 for local docker runs
ENV PORT=80
EXPOSE 80
