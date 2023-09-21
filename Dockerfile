FROM node:19.7.0-alpine3.17

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm i

COPY next.config.js next.config.js
COPY postcss.config.js postcss.config.js
COPY public public
COPY src src

RUN npm ci --omit=dev

ENTRYPOINT ["npm", "run", "start"]
