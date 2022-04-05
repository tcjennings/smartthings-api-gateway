FROM node:lts

EXPOSE 3000

ENV NODE_ENV production

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY src .

CMD ["node", "app.js"]
