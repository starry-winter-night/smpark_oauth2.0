FROM node:20.14.0 AS base

WORKDIR /usr/src/oauth2.0

# Yarn PnP Zero Install 관련 파일들
COPY .yarn .yarn
COPY .pnp.* ./
COPY package.json yarn.lock ./

# 설정 파일들
COPY nodemon.json .prettierrc ./
COPY *.config.js *.config.mjs ./
COPY tsconfig.json ./

# 소스 코드
COPY src ./src

FROM base AS production
# 빌드 파일
COPY dist ./dist 

# Prod 글로벌 yarn을 사용 -> corepack 연결 -> 지정 yarn 사용 변경
RUN corepack enable 

ENV NODE_ENV=production
EXPOSE 5555
CMD ["yarn", "prod"]

FROM base AS development
ENV NODE_ENV=development
EXPOSE 4000
CMD ["yarn", "dev"]