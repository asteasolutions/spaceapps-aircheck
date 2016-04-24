import { GraphQLObjectType } from 'graphql';
import { ReportedSymptomQueries } from '../reported_symptom';
import { TileInfoQueries } from '../tile_info';
import { globalIdField } from 'graphql-relay';
import Node from '../node';

const TYPE_NAME = 'Viewer';

Node.setIdFetcher(TYPE_NAME, () => Promise.resolve({}));

export default new GraphQLObjectType({
  name: TYPE_NAME,
  description: 'A fictive root type that represents the current user.',
  fields: () => ({
    id: globalIdField(TYPE_NAME, () => 'viewer'),
    ...ReportedSymptomQueries,
    ...TileInfoQueries,
  }),

  implements: [Node.interface],
});
