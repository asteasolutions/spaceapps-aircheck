import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
} from 'graphql';
import Node from './node';
import { ReportedSymptomMutations } from './reported_symptom';
import { ViewerType } from './viewer';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    node: Node.field,
    // "Viewer" is a root query field that's used as a kind of a standard hack that allows Relay
    // to perform some types of queries. It's only purpose is to wrap all other queries at the
    // top level. At some point we may also use it to identify the currently logged in user.
    viewer: {
      type: new GraphQLNonNull(ViewerType),
      resolve: () => ({}),
    },
  }),
});

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    ...ReportedSymptomMutations,
  }),
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export default schema;
