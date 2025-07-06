FROM node:20
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm run prod-linux
CMD ["node", "web-server/server.js"]
