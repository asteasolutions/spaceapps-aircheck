import '../../css/app.css';
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
import Stat from './Stat';
import { PanelGroup, Panel } from 'react-bootstrap';


class Home extends Component {
  constructor(props) {
    super(props);
    this._onGetCurrentCoords = this._onGetCurrentCoordsClick.bind(this);

    this.state = {
      filterDate: {
        format: 'YYYY-MM-DD',
        value: '2016-04-24',
      },
    };
  }

  onChangeDateFilter(date) {
    this.props.dispatch(changeDate(date));
    this.props.relay.setVariables({ filter: { date } });
  }

  _onGetCurrentCoordsClick() {
    this.props.dispatch(loadCurrentLocation());
  }

  render() {
    const { reportedSymptoms } = this.props.viewer;

    return (
      <main className='container-fluid'>
        <div className='row'>
          <div id='left-panel' className='col-md-4'>
            <div id='left-header' className='text-center'><p>Boreas</p></div>
            <PanelGroup defaultActiveKey='1' accordion>
              <Panel header='Report a Symptom' eventKey='1'>
                <SymptomForm />
              </Panel>
              <Panel header='Select Data Layers' eventKey='2'>
                <LayersList />
                <DateTimeField
                  dateTime={this.state.filterDate.value}
                  onChange={this.onChangeDateFilter.bind(this)}
                  format={this.state.filterDate.format}
                  inputFormat='DD/MM/YYYY'
                />
              </Panel>
            </PanelGroup>
          </div>
          <WorldMap reportedSymptoms={reportedSymptoms}
            filterDate={this.state.filterDate.value}
            areSymptomsVisible={this.props.areSymptomsVisible}
          />
        </div>
        <div className='row'>
          <h4>Reported symptoms</h4>
          <ReportedSymptomsList reportedSymptoms={reportedSymptoms} />
        </div>
        <Stat
          layer='MODIS_Terra_Aerosol'
          tileCoords={[{ x: 13, y: 32 }, { x: 13, y: 33 }]}
          bbox={[[20, 40], [25, 45]]}
          zoomLevel={6}
          fromDate='2016-04-17'
          toDate='2016-04-19'
          viewer={this.props.viewer}
        />
      </main>
    );
  }
}

export default createComponent(Home, {
  relayConfig: {
    initialVariables: {
      filter: { date: '2016-04-24'},
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          reportedSymptoms(filter: $filter) {
            id
            name
            date
            coords
            grade
            category
            ${ReportedSymptomsList.getFragment('reportedSymptoms')}
          }
          ${Stat.getFragment('viewer')}
        }
      `,
    },
  },
  reduxConfig: {
    mapStateToProps: (state) => state.Location,
  },
});
