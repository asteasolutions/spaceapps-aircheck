import '../../css/app.css'
import React, { Component } from 'react';
import Relay from 'react-relay';
import DateTimeField from 'react-bootstrap-datetimepicker';
import createComponent from '../utils/createComponent';
import { loadCurrentLocation } from '../actions/HomeActions';
import { changeDate } from '../actions/LayersActions';
import ReportedSymptomsList from './ReportedSymptomsList';
import SymptomForm from './SymptomForm';
import WorldMap from './WorldMap';
import LayersList from './LayersList';
import { PanelGroup, Panel } from 'react-bootstrap';

class Home extends Component {
  constructor(props) {
    super(props);
    this._onGetCurrentCoords = this._onGetCurrentCoordsClick.bind(this);
    this._onToggleSymptoms = this._onToggleSymptomsClick.bind(this);

    this.state = {
      areSymptomsVisible: false,
      filterDate: {
        format: 'YYYY-MM-DD',
        value: '2015-03-03'
      }
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

  onChangeDateFilter(value) {
    this.props.dispatch(changeDate(value));
  }

  render() {
    const { reportedSymptoms } = this.props.viewer;
    const { areSymptomsVisible } = this.state;

    return (
      <main className='container-fluid'>
        <div className='row'>
          <div id='left-panel' className='col-md-3'>
            <div id='left-header' className='text-center'><p>Aircheck</p></div>
            <PanelGroup defaultActiveKey='1' accordion>
              <Panel header='Report a Symptom' eventKey='1'>
                <SymptomForm />
              </Panel>
              <Panel header='Select Data Layers' eventKey='2'>
                <LayersList />
                <button className='btn btn-success' onClick={this._onToggleSymptoms}>
                  {areSymptomsVisible ? 'Hide' : 'Show'} Symptoms
                </button>
                <DateTimeField
                  dateTime={this.state.filterDate.value}
                  onChange={this.onChangeDateFilter.bind(this)}
                  format={this.state.filterDate.format}>
                </DateTimeField>
              </Panel>
            </PanelGroup>
          </div>
          <WorldMap reportedSymptoms={reportedSymptoms}
            filterDate={this.state.filterDate.value}
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
