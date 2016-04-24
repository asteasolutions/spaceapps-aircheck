import 'babel-polyfill';
import Schema from './schema';
import graphqlHTTP from 'express-graphql';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const config = require('./config/main.json');
const port = global.process.env.PORT || 1234;
const server = global.server = express();

mongoose.connect(config.mongoDB);

server.use(cors());
server.use('/graphql', graphqlHTTP(request => ({
  schema: Schema,
  rootValue: { session: request.session },
  graphiql: true,
})));

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`The server is running at http://localhost: ${port}`);
});
