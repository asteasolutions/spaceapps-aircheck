import fs from 'fs';
import path from 'path';
import Schema from '../src/schema';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

export default async () => {
  // Save JSON of full schema introspection for Babel Relay Plugin to use
  await (async () => {
    const result = await (graphql(Schema, introspectionQuery));
    if (result.errors) {
      // eslint-disable-next-line no-console
      console.error(
        'ERROR introspecting schema: ',
        JSON.stringify(result.errors, null, 2)
      );
    } else {
      fs.writeFileSync(
        path.join(__dirname, '../../schema/schema.json'),
        JSON.stringify(result, null, 2)
      );
    }
  })();

  // Save user readable type system shorthand of schema
  fs.writeFileSync(
    path.join(__dirname, '../../schema/schema.graphql'),
    printSchema(Schema)
  );
};
