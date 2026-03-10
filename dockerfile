FROM node:24 AS base

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . . 

EXPOSE 3000

CMD ["pnpm", "dev" ]