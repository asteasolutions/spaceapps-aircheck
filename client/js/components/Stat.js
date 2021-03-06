import _ from 'lodash';
import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import createComponent from '../utils/createComponent';
import stat from 'simple-statistics';
import Chart from './Chart';


class Stat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reportedSymptomsByDate: [],
      tilesInfoByDate: [],
      correlation: 0,
    };
  }

  componentWillMount() {
    this._updateRelayVariables(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this._updateRelayVariables(nextProps);
    }

    const { reportedSymptoms, tilesInfo } = this.props.viewer;
    if (reportedSymptoms && tilesInfo) {
      let reportedSymptomsByDate = [];
      let tilesInfoByDate = [];
      const symptomsMap = _.groupBy(reportedSymptoms, 'date');
      const tilesMap = _.groupBy(tilesInfo, 'date');
      Object.keys(symptomsMap).forEach((date) => {
        reportedSymptomsByDate.push({
          date,
          value: symptomsMap[date].length,
        });
        tilesInfoByDate.push({
          date,
          value: _.mean(tilesMap[date].map((t) => t.sampleValue)),
        });
      });

      reportedSymptomsByDate = _.sortBy(reportedSymptomsByDate, 'date');
      tilesInfoByDate = _.sortBy(tilesInfoByDate, 'date');
      const correlation = stat.sampleCorrelation(
        reportedSymptomsByDate.map((s) => s.value),
        tilesInfoByDate.map((t) => t.value),
      );
      this.setState({
        reportedSymptomsByDate,
        tilesInfoByDate,
        correlation,
      });
    }
  }

  _updateRelayVariables(props) {
    this.props.relay.setVariables({
      symptomsFilter: {
        date: props.fromDate,
        toDate: props.toDate,
        containment: props.bbox,
      },
      tilesFilter: {
        layer: props.layer,
        coords: props.tileCoords,
        fromDate: props.fromDate,
        toDate: props.toDate,
        zoomLevel: props.zoomLevel,
      },
      loaded: true,
    });
  }

  render() {
    const dates = this.state.reportedSymptomsByDate.map((s) => moment(s.date).toDate());
    console.log(this.props);
    return dates && dates.length
    ? (<div>
      <Chart
        symptomCounts={ this.state.reportedSymptomsByDate.map((s) => s.value) }
        layerValues={ this.state.tilesInfoByDate.map((t) => t.value) }
        dates={ dates }
      />
      <p>
      Correlation between data from layer <b>{this.props.layer}</b> and reported symptoms between
      <b> {this.props.fromDate}</b> and <b>{this.props.toDate}</b>: <b>{this.state.correlation}</b>.
      </p>
    </div>)
    : (<span></span>);
  }
}

Stat.propTypes = {
  layer: PropTypes.string.isRequired,
  tileCoords: PropTypes.array.isRequired,
  bbox: PropTypes.array.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  zoomLevel: PropTypes.number.isRequired,
};

export default createComponent(Stat, {
  relayConfig: {
    initialVariables: {
      symptomsFilter: null,
      tilesFilter: null,
      loaded: false,
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on Viewer {
          reportedSymptoms(filter: $symptomsFilter) @include(if: $loaded) {
            date
            grade
          }
          tilesInfo(filter: $tilesFilter) @include(if: $loaded) {
            date
            sampleValue
          }
        }
      `,
    },
  },
});
