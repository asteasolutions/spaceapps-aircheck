import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import createComponent from '../utils/createComponent';

const ReportedSymptomsList = (props) => {
  const fields = ['name', 'date', 'coords', 'grade', 'category'];
  const reportedSymptoms = props.reportedSymptoms.map((symptom) => (
    <tr key={symptom.id}>
      { fields.map((field) => (<td key={field}>{symptom[field]}</td>)) }
    </tr>
  ));

  return (
    <table>
      <tbody>
        <tr>
          { fields.map((field) => (<th key={field}>{field}</th>)) }
        </tr>
        {reportedSymptoms}
      </tbody>
    </table>
  );
};

ReportedSymptomsList.propTypes = {
  reportedSymptoms: PropTypes.array.isRequired,
};

export default createComponent(ReportedSymptomsList, {
  relayConfig: {
    fragments: {
      reportedSymptoms: () => Relay.QL`
        fragment on ReportedSymptom @relay(plural: true) {
          id
          name
          date
          coords
          grade
          category
        }
      `,
    },
  },
});
