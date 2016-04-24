import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import createComponent from '../utils/createComponent';

class Stat extends Component {
  componentWillMount() {
    this._updateRelayVariables(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this._updateRelayVariables(nextProps);
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
    console.log(this.props.viewer.reportedSymptoms);
    console.log(this.props.viewer.tilesInfo);

    return (<span>bu</span>);
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
            coords
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
