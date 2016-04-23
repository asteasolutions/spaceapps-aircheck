import React, { Component } from 'react';
import Relay from 'react-relay';
import createComponent from '../utils/createComponent';
import { loadCurrentLocation } from '../actions/HomeActions';
import ReportedSymptomsList from './ReportedSymptomsList';
import SymptomForm from './SymptomForm';
import WorldMap from './WorldMap';
import LayersList from './LayersList';

class Home extends Component {
  constructor(props) {
    super(props);
    this._onGetCurrentCoords = this._onGetCurrentCoordsClick.bind(this);
    this._onToggleSymptoms = this._onToggleSymptomsClick.bind(this);

    this.state = {
      areSymptomsVisible: false,
    };
  }

  _onGetCurrentCoordsClick() {
    this.props.dispatch(loadCurrentLocation());
  }

  _onToggleSymptomsClick() {
    this.setState({
      areSymptomsVisible: !this.state.areSymptomsVisible,
    });
  }

  render() {
    const { reportedSymptoms } = this.props.viewer;
    const { areSymptomsVisible } = this.state;

    return (
      <main className='container-fluid'>
        <div className='row'>
          <div id='left-panel' className='col-md-4'>
            <SymptomForm />
            <LayersList />
            <button className='btn btn-success' onClick={this._onToggleSymptoms}>
              {areSymptomsVisible ? 'Hide' : 'Show'} Symptoms
            </button>
          </div>
          <WorldMap reportedSymptoms={reportedSymptoms}
            areSymptomsVisible={this.state.areSymptomsVisible}
          />
        </div>
        <div className='row'>
          <h4>Reported symptoms</h4>
          <ReportedSymptomsList reportedSymptoms={reportedSymptoms} />
        </div>
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
            id
            name
            date
            coords
            grade
            category
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
