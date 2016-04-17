import {
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLNonNull,
} from 'graphql';
import GraphQLDateType from 'graphql-custom-datetype';
import ReportedSymptomType from './type';
import ReportedSymptom from '../../models/reported_symptom';
import { ViewerType } from '../viewer';
import { mutationWithClientMutationId } from 'graphql-relay';

export default {
  addReportedSymptom: mutationWithClientMutationId({
    name: 'AddReportedSymptom',
    inputFields: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      date: { type: GraphQLDateType },
      coords: { type: new GraphQLList(GraphQLFloat) },
    },
    outputFields: {
      reportedSymptom: {
        type: ReportedSymptomType,
        resolve: (payload) => payload,
      },
      viewer: {
        type: ViewerType,
        resolve: () => ({}),
      },
    },

    mutateAndGetPayload: (input) => new Promise((resolve, reject) => {
      const reportedSymptom = new ReportedSymptom({
        name: input.name,
        date: input.date,
        location: {
          type: 'Point',
          coordinates: input.coords,
        },
      });

      reportedSymptom.save((err, res) => (err ? reject(err) : resolve(res)));
    }),
  }),
};
