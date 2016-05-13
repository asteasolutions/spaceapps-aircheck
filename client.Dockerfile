FROM nginx:1.10

RUN apt-get update && apt-get install -y curl \
        && curl -sL https://deb.nodesource.com/setup_6.x | bash \
        && apt-get install -y nodejs
        
WORKDIR /build

WORKDIR server

ADD server/package.json ./

RUN ["npm", "install", "-q"]

WORKDIR ../client

ADD client/package.json ./

RUN ["npm", "install", "-q"]

WORKDIR  ../

ADD . .

RUN  cd server && npm run update-schema && cd ../client && npm run build