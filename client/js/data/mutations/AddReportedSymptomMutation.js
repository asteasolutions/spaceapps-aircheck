import Relay from 'react-relay';

export default class AddReportedSymptomMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { addReportedSymptom }`;
  }

  getVariables() {
    return {
      name: this.props.name,
      coords: [this.props.lon, this.props.lat],
      grade: this.props.grade,
      category: this.props.category,
      date: this.props.date,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddReportedSymptomPayload {
        viewer {
          reportedSymptoms
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        // XXX: Currently there is only one viewer with a well-known ID, but still
        // hardcoding it here doesn't look very good. Think of a way to pass it along as
        // a parameter for the mutation or at least store it somewhere as a constant.
        viewer: 'Vmlld2VyOnZpZXdlcg==',
      },
    }];
  }
}
