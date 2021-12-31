FROM node:16.10-alpine

WORKDIR /phaedra-client

ENV PATH="./node_modules/.bin:$PATH"

COPY package.json ./

RUN npm install

COPY . .

ENV NODE_PATH=./build

RUN npm run build

CMD ["npm", "start"]