import { GraphQLObjectType, GraphQLString } from 'graphql';
import { ReportedSymptomQueries } from '../reported_symptom';
import { TileInfoQueries } from '../tile_info';
import { globalIdField } from 'graphql-relay';
import Node from '../node';

const TYPE_NAME = 'Viewer';

Node.setIdFetcher(TYPE_NAME, () => Promise.resolve({ type: 'viewer' }));

export default new GraphQLObjectType({
  name: TYPE_NAME,
  description: 'A fictive root type that represents the current user.',
  fields: () => ({
    id: globalIdField(TYPE_NAME, () => 'viewer'),
    type: {
      type: GraphQLString,
      resolve: () => 'viewer',
    },
    ...ReportedSymptomQueries,
    ...TileInfoQueries,
  }),
  isTypeOf: (obj) => obj.type === 'viewer',

  interfaces: [Node.interface],
});
