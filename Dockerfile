ARG NODE_VERSION

# Based on https://github.com/vercel/next.js/tree/canary/examples/with-docker
FROM node:${NODE_VERSION}-alpine3.19 as base
# Create non-root user, copied from https://github.com/dotnet/dotnet-docker/blob/main/src/runtime-deps/8.0/alpine3.19/amd64/Dockerfile
ENV APP_UID=1654
RUN addgroup --gid=$APP_UID app && adduser --uid=$APP_UID --ingroup=app --disabled-password app

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci


# Rebuild the source code only when needed
FROM base AS builder
ARG ENVIRONMENT
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -- --mode $ENVIRONMENT


# Production image, copy all the files and run nginx
FROM nginx:alpine3.19 AS final
# Run the container as non-root
USER $APP_UID
WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080
# https://stackoverflow.com/a/28099946
CMD ["nginx", "-g", "daemon off;"]
