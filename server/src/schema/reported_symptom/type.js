import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import GraphQLDateType from 'graphql-custom-datetype';
import Node from '../node';
import ReportedSymptom from '../../models/reported_symptom';

const TYPE_NAME = 'ReportedSymptom';

Node.setIdFetcher(TYPE_NAME, (id) => new Promise((resolve, reject) =>
    ReportedSymptom.findById(id, (err, res) => (err ? reject(err) : resolve(res)))));

export default new GraphQLObjectType({
  name: TYPE_NAME,
  description: 'A symptom reported by a user at a given date and location.',
  fields: () => ({
    id: globalIdField(TYPE_NAME, (obj) => obj._id.toString()),
    name: { type: GraphQLString },
    date: { type: GraphQLDateType },
    coords: {
      type: new GraphQLList(GraphQLFloat),
      resolve: (obj) => obj.location.coordinates,
    },
  }),
  isTypeOf: (obj) => obj instanceof ReportedSymptom,

  interfaces: [Node.interface],
});
