FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run prod-linux
RUN npm prune --omit=dev
CMD ["node", "web-server/server.js"]
