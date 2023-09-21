FROM node:19.7.0-alpine3.17

WORKDIR /app

COPY public public
COPY src src
COPY next.config.js next.config.js
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY postcss.config.js postcss.config.js

RUN npm run build

ENTRYPOINT ["npm", "run", "start"]
