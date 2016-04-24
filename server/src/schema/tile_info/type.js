import moment from 'moment';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import Node from '../node';
import TileInfo from '../../models/tile_info';

const TYPE_NAME = 'TileInfo';

Node.setIdFetcher(TYPE_NAME, (id) => new Promise((resolve, reject) =>
    TileInfo.findById(id, (err, res) => (err ? reject(err) : resolve(res)))));

export default new GraphQLObjectType({
  name: TYPE_NAME,
  description: 'Statistical information about a map tile calculated on data collected by NASA.',
  fields: () => ({
    id: globalIdField(TYPE_NAME, (obj) => obj._id.toString()),
    date: {
      type: GraphQLString,
      resolve: (obj) => moment(obj.date).format('YYYY-MM-DD'),
    },
    coords: {
      type: new GraphQLObjectType({
        name: 'Coords',
        fields: () => ({
          x: { type: GraphQLInt },
          y: { type: GraphQLInt },
        }),
      }),
    },
    zoom: { type: GraphQLInt },
    layer: { type: GraphQLString },
    sampleValue: { type: GraphQLFloat },
  }),
  isTypeOf: (obj) => obj instanceof TileInfo,

  interfaces: [Node.interface],
});
