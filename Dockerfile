FROM node:20.14.0 AS base

WORKDIR /usr/src/app

COPY . .

RUN yarn install --immutable

FROM base AS production
ENV NODE_ENV=production
EXPOSE 3333
CMD ["yarn", "prod"]

FROM base AS development
ENV NODE_ENV=development
EXPOSE 4000
CMD ["yarn", "dev"]