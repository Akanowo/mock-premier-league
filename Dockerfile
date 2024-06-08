FROM node:16-alpine3.11

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 9000

CMD [ "node", "-r", "dotenv/config", "dist/main.js" ]
