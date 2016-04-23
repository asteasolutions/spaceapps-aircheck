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
      <main>
        <h1>Reported symptoms</h1>
        <ReportedSymptomsList reportedSymptoms={reportedSymptoms} />
        <br />
        <div style={ { width: '50%' } } >
          <SymptomForm />
        </div>
        <button className='btn btn-success' onClick={this._onToggleSymptoms}>
          {areSymptomsVisible ? 'Hide' : 'Show'} Symptoms
        </button>
        <WorldMap reportedSymptoms={reportedSymptoms} areSymptomsVisible={this.state.areSymptomsVisible} />
        <LayersList />
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
