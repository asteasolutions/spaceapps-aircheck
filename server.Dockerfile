FROM node:6.1   

WORKDIR /build

ADD server/package.json ./

RUN ["npm", "install", "-q"]

WORKDIR /app

RUN ["cp", "/build/package.json", "/app/"]

RUN ["npm", "install", "--production", "-q"]

WORKDIR /build

ADD server .

RUN ["npm", "run", "build"]

RUN ["cp", "/build/dist/server.js", "/app/"]

WORKDIR /app

ENTRYPOINT ["node"]

CMD ["server"]
