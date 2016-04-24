import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
} from 'graphql';
import { fromGlobalId } from 'graphql-relay';
import { CalendarDateType } from '../calendar_date';
import ReportedSymptomType from './type';
import ReportedSymptom from '../../models/reported_symptom';

const ReportedSymptomsFilterType = new GraphQLInputObjectType({
  name: 'ReportedSymptomsFilter',
  fields: () => ({
    name: { type: GraphQLString },
    date: { type: CalendarDateType },
    category: { type: GraphQLString },
    containment: { type: new GraphQLList(new GraphQLList(GraphQLFloat)) },
  }),
});

export default {
  reportedSymptom: {
    type: ReportedSymptomType,
    args: {
      id: { type: GraphQLID },
    },
    resolve: (root, { id: globalId }) => new Promise((resolve, reject) => {
      const { id } = fromGlobalId(globalId);
      ReportedSymptom.findById(id, (err, res) => (err ? reject(err) : resolve(res)));
    }),
  },
  reportedSymptoms: {
    type: new GraphQLList(ReportedSymptomType),
    args: {
      filter: { type: ReportedSymptomsFilterType },
    },
    resolve: (root, { filter }) => ReportedSymptom.filter(filter || {}),
  },
};
