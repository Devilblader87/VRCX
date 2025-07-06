FROM node:20
WORKDIR /app
COPY . .

RUN npm install
RUN npm run prod-linux
RUN npm prune --omit=dev

RUN npm install --production
RUN npm run prod-linux

CMD ["node", "web-server/server.js"]
