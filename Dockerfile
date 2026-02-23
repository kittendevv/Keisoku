# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1
WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY src ./src
COPY keisoku*.yaml ./

USER bun
EXPOSE 3000
ENTRYPOINT [ "bun", "start" ]