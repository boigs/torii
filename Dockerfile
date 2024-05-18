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
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The NODE_ENV is used by next build, we cannot change it after building the app with our current setup
ENV NODE_ENV production
RUN npm run build


# Production image, copy all the files and run next
FROM base AS final
# Run the container as non-root
USER $APP_UID
WORKDIR /app

COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED 1
ENV HOSTNAME "0.0.0.0"
ENV PORT 8080

EXPOSE 8080
ENTRYPOINT ["node", "server.js"]
