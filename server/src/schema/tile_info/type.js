import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import Node from '../node';
import TileInfo from '../../models/tile_info';
import TileInfoUtil from '../../util/tile_info_util';

const TYPE_NAME = 'TileInfo';

Node.setIdFetcher(TYPE_NAME, (id) => new Promise((resolve, reject) =>
    TileInfo.findById(id, (err, res) => (err ? reject(err) : resolve(res)))));

export default new GraphQLObjectType({
  name: TYPE_NAME,
  description: 'Statistical information about a map tile calculated on data collected by NASA.',
  fields: () => ({
    id: globalIdField(TYPE_NAME, (obj) => obj._id.toString()),
    uid: {
      type: GraphQLString,
      resolve: TileInfoUtil.getTileUid,
    },
    sampleValue: { type: GraphQLFloat },
  }),
  isTypeOf: (obj) => obj instanceof TileInfo,

  interfaces: [Node.interface],
});
