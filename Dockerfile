FROM node:20.10.0-alpine3.18 AS builder

# # Create app directory
WORKDIR /tmp/app

COPY . .
ARG DEPLOY_ENV
ENV DEPLOY_ENV=${DEPLOY_ENV}

# Step 1: Install ALL deps (including dev)
RUN npm ci

# Step 2: Set production mode AFTER installing
ENV NODE_ENV=production

# Step 3: Run build (eslint will still work)
RUN npm run build

FROM nginx:alpine

COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /tmp/app/build /usr/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
