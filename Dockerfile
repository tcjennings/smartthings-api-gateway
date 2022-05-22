FROM node:lts-slim

EXPOSE 3000

ENV NODE_ENV production

WORKDIR /opt/app

COPY package*.json config.yaml ./

RUN npm install

COPY dist .

CMD ["node", "app.js"]
