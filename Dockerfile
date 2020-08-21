# Build stage
FROM node:lts-alpine as build

RUN apk update; \
  apk add git;
WORKDIR /tmp
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Release stage
FROM node:10-alpine as release

RUN apk update && apk add git && apk add tzdata && TZ=Asia/Bangkok && cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && apk del tzdata && apk add yarn python g++ make

VOLUME /parse-server/cloud /parse-server/config

WORKDIR /parse-server

COPY package*.json ./

RUN npm ci --production --ignore-scripts

COPY bin bin
COPY public_html public_html
COPY views views
COPY --from=build /tmp/lib lib
RUN mkdir -p logs && chown -R node: logs

RUN npm install pm2 -g

ENV PORT=1337
USER node
EXPOSE $PORT

ENTRYPOINT ["pm2-runtime","./bin/parse-server","-i","max"]
