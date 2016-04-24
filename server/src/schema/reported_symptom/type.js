import moment from 'moment';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
} from 'graphql';
import { globalIdField } from 'graphql-relay';
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
    date: {
      type: GraphQLString,
      resolve: (obj) => moment(obj.date).format('YYYY-MM-DD'),
    },
    coords: {
      type: new GraphQLList(GraphQLFloat),
      resolve: (obj) => obj.location.coordinates,
    },
    grade: { type: GraphQLInt },
    category: { type: GraphQLString },
  }),
  isTypeOf: (obj) => obj instanceof ReportedSymptom,

  interfaces: [Node.interface],
});
