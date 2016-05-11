FROM node:6.1   

WORKDIR app

COPY package.json .

ADD package.json ./

RUN ["npm", "install", "--production", "-q"]

ADD dist/ ./

ENTRYPOINT ["node"]

CMD ["server"]
