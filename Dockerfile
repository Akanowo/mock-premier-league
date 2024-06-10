FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 9000

CMD [ "node", "-r", "dotenv/config", "dist/main.js" ]
