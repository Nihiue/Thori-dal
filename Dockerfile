FROM node:12-alpine as builder
MAINTAINER Wanglei<nihiue@gmail.com>

RUN npm install -g npm@6.10.0
#RUN npm config set disturl https://npm.taobao.org/dist --global
#RUN npm config set registry https://registry.npm.taobao.org --global

WORKDIR /buidler

COPY server ./server
COPY client-web-ng ./client-web-ng

RUN cd ./server && npm install
RUN cd ./client-web-ng && npm install && npm run build

FROM node:12-alpine

COPY --from=builder /buidler/server /server
COPY --from=builder /buidler/client-web-ng/dist /server/public

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /server/app

EXPOSE 3000
ENTRYPOINT node index.js
