FROM node:20

RUN apt-get update && \
    apt-get install -y dotnet-runtime-9.0 && \
    rm -rf /var/lib/apt/lists/*
ENV DOTNET_ROOT=/usr/lib/dotnet

WORKDIR /app
COPY . .

RUN npm install
RUN npm run prod-linux
RUN npm prune --omit=dev

RUN npm install --production
RUN npm run prod-linux

CMD ["node", "web-server/server.js"]
