import _ from 'lodash';
import React, { Component } from 'react';
import createComponent from '../utils/createComponent';
import { loadCurrentLocation } from '../actions/HomeActions';

class WorldMap extends Component {
  componentDidMount() {
    this._initMap();
  }

  updateSymptomLayer(symptoms, areSymptomsVisible) {
    const data = symptoms.map(symptom => {
      const [lng, lat] = symptom.coords;
      return {
        location: new google.maps.LatLng(lat, lng),
        weight: symptom.grade
      };
    });

    this.symptomLayer.setData(data);
    this.symptomLayer.setMap(areSymptomsVisible ? this._map : null);
  }

  componentWillReceiveProps(props) {
    const overlayMapTypes = this._map.overlayMapTypes;
    const layers = this._map.overlayMapTypes.getArray();
    const indicesToRemove = [];

    this.updateSymptomLayer(props.reportedSymptoms, props.areSymptomsVisible);

    _.each(layers, (layer, index) => {
      if (!_.find(props.activeLayers, { key: layer.name })) {
        indicesToRemove.push(index);
      }
    });
    _.each(indicesToRemove, index => overlayMapTypes.removeAt(index));

    _.each(props.activeLayers, layer => {
      if (!_.find(layers, { name: layer.key })) {
        overlayMapTypes.push(layer.getLayer());
      }
    });

    return;
  }

  _initMap() {
    this.props.dispatch(loadCurrentLocation());

    this._map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 42.6489298,
        lng: 23.3955345,
      },
      zoom: 6,
      minZoom: 1,
      zoom: 20,
      // maxZoom: ,
    });

    // set symptom layer
    this.symptomLayer = new google.maps.visualization.HeatmapLayer({});
    this.symptomLayer.setMap(this._map);
  }

  render() {
    const style = {
      width: '100%',
      height: '100vh',
      border: 'blue',
    };
    return (
      <div className='col-md-8' style={{ paddingRight: 0 + 'px', paddingLeft: 0 + 'px' }}>
        <div id='map' className='map' style={ style }></div>
      </div>
    );
  }
}

export default createComponent(WorldMap, {
  reduxConfig: {
    mapStateToProps: state => state.Layers,
  },
});
