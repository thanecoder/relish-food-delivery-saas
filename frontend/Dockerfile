FROM node:24-alpine AS build
WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration production

FROM nginx:1.29-alpine
COPY --from=build /build/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# nginx fills this template in from the env vars each time the container starts
COPY runtime-config.js.template /etc/nginx/templates/runtime-config.js.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/usr/share/nginx/html \
    FARO_URL="" \
    FARO_ENVIRONMENT=local
EXPOSE 80
