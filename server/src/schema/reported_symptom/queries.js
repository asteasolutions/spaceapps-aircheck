import {
  GraphQLList,
  GraphQLID,
} from 'graphql';
import { fromGlobalId } from 'graphql-relay';
import ReportedSymptomType from './type';
import ReportedSymptom from '../../models/reported_symptom';

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
    resolve: () => new Promise((resolve, reject) => {
      ReportedSymptom.find({}, (err, res) => (err ? reject(err) : resolve(res)));
    }),
  },
};
