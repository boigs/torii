FROM node:20.7.0-alpine3.17

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --omit=dev

COPY next.config.js next.config.js
COPY tsconfig.json tsconfig.json
COPY postcss.config.js postcss.config.js
COPY public public
COPY src src

RUN npm run build

ENV ENVIRONMENT="inject a value via the compose/k8s file, or docker run --env or --env_file"

ENTRYPOINT ["npm", "run", "start"]
