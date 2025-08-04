ARG NODE_BASE_IMAGE=node:22-alpine3.20

FROM ${NODE_BASE_IMAGE} AS base

ENV ITEMS_NUMBER=5
ENV WORKERS_NUMBER=3
ENV NODE_ENV=development

FROM base AS dev

WORKDIR /app

CMD ["npm", "run", "start:dev"]


FROM base AS deps

WORKDIR /usr/app

COPY package.json package-lock.json ./

RUN npm ci


FROM deps AS prod

COPY . .

CMD ["npm", "start"]
