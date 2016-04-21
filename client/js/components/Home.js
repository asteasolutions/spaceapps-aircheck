import React, { Component } from 'react';
import Relay from 'react-relay';
import createComponent from '../utils/createComponent';
import { loadCurrentLocation } from '../actions/HomeActions';
import ReportedSymptomsList from './ReportedSymptomsList';
import AddReportedSymptomMutation from '../data/mutations/AddReportedSymptomMutation';

class Home extends Component {
  constructor(props) {
    super(props);
    this._onGetCurrentCoords = this._onGetCurrentCoordsClick.bind(this);
    this._onAddSymptom = this._onAddSymptomClick.bind(this);
  }

  _onAddSymptomClick() {
    const props = {
      name: this.refs.name.value,
      lon: this.refs.lon.valueAsNumber,
      lat: this.refs.lat.valueAsNumber,
      category: this.refs.category.value,
      grade: this.refs.grade.valueAsNumber,
    };

    const areAllVluesSet = Object.keys(props).reduce((prev, key) => prev && !!props[key], true);
    if (areAllVluesSet) {
      Relay.Store.commitUpdate(new AddReportedSymptomMutation(props));
    }
  }

  _onGetCurrentCoordsClick() {
    this.props.dispatch(loadCurrentLocation());
  }

  render() {
    const { reportedSymptoms } = this.props.viewer;
    const { lon, lat, isLoading, error } = this.props;
    return (
      <main>
        <h1>Reported symptoms</h1>
        <ReportedSymptomsList reportedSymptoms={reportedSymptoms} />
        Name: <input type='text' ref='name' /><br />
        Category: <input type='text' ref='category' /><br />
        Grade: <input type='number' min='1' max='3' ref='grade' /><br />
        Coordinates:
          <input type='number' step='0.01' value={lon || ''} placeholder='longitude' ref='lon' />
          <input type='number' step='0.01' value={lat || ''} placeholder='latitude' ref='lat' />
          <button onClick={this._onGetCurrentCoords}>Load current coordinates</button>
          {
            isLoading ? <span>Loading...</span>
            : error ? <span>{error}</span>
            : null
          }
          <br />
        <button className='btn btn-success' onClick={this._onAddSymptom}>Report symptom</button>
      </main>
    );
  }
}

export default createComponent(Home, {
  relayConfig: {
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          reportedSymptoms {
            ${ReportedSymptomsList.getFragment('reportedSymptoms')}
          }
        }
      `,
    },
  },
  reduxConfig: {
    mapStateToProps: (state) => state.Location,
  },
});
