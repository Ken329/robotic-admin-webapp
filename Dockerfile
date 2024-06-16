FROM node:20.10.0-alpine3.18 AS builder

# # Create app directory
WORKDIR /tmp/app

COPY . .
ARG DEPLOY_ENV
ENV DEPLOY_ENV=${DEPLOY_ENV}
ENV NODE_ENV=production

RUN npm ci
RUN npm run build

FROM nginx:alpine

COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /tmp/app/build /usr/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]