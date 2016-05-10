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
import { requestTileCoordinates } from '../actions/WorldMapActions';
import { PanelGroup, Panel, ButtonGroup, Button, Input } from 'react-bootstrap';
import { generateDummyData } from '../data/dummyDataGenerator';
import Chart from './Chart';

class Home extends Component {
  constructor(props) {
    super(props);
    this._onGetCurrentCoords = this._onGetCurrentCoordsClick.bind(this);
    this._onRequestTileCoordinates = this._onRequestTileCoordinatesClick.bind(this);

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

  _onRequestTileCoordinatesClick() {
    this.props.dispatch(requestTileCoordinates());
  }

  render() {
    const { reportedSymptoms } = this.props.viewer;

    const now = new Date();
    const dates = [
      new Date(now.setDate(17)),
      new Date(now.setDate(18)),
      new Date(now.setDate(19)),
      new Date(now.setDate(20)),
      new Date(now.setDate(21)),
    ];

    return (
      <main className='container-fluid'>
        <div className='row'>
          <div id='left-panel' className='col-md-3'>
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
          <Button onClick={ this._onRequestTileCoordinates }>Get Tile Coordinate</Button>
          <Button onClick={ generateDummyData }>Generate Dummy Data</Button>
          <Stat
            layer='AIRS_CO_Total_Column_Day'
            tileCoords={[{ x: 13, y: 32 }, { x: 13, y: 33 }]}
            bbox={[[20, 40], [25, 45]]}
            zoomLevel={6}
            fromDate='2016-05-01'
            toDate='2016-05-10'
            viewer={this.props.viewer}
          />
          { /* <h4>Reported symptoms</h4>
          <ReportedSymptomsList reportedSymptoms={reportedSymptoms} /> */ }
        </div>
      </main>
    );
  }
}

export default createComponent(Home, {
  relayConfig: {
    initialVariables: {
      filter: { date: '2016-04-24' },
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
