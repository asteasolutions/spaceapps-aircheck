import _ from 'lodash';
import React, { Component } from 'react';
import createComponent from '../utils/createComponent';
import { loadCurrentLocation } from '../actions/HomeActions';
import { centerMap, moveMap, moveMarker } from '../actions/WorldMapActions';

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this._centerMap = this._centerMapClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(loadCurrentLocation());

    this._initMap();
    this._initMarker();
    this._centerMap();
  }

  componentWillReceiveProps(props) {
    this.updateSymptoms(props.reportedSymptoms, props.areSymptomsVisible);
    this._updateLayers(props.WorldMap.Layers);
    this._updateCurrentLocation(props);
  }

  _initMap() {
    this._map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 0,
        lng: 0,
      },
      zoom: 2,
      minZoom: 1,
    });

    // set symptom layer
    this.symptomLayer = new google.maps.visualization.HeatmapLayer({});
    this.symptomLayer.setMap(this._map);

    const onMapViewChanged = () => {
      if (this.props.WorldMap.Location.isMapCentered) {
        this.props.dispatch(moveMap());
      }
    };

    this._map.addListener('drag', onMapViewChanged);
    this._map.addListener('zoom_changed', onMapViewChanged);
  }

  _initMarker() {
    const mapCenter = this._map.getCenter();
    this._marker = new google.maps.Marker({
      map: this._map,
      position: mapCenter,
      draggable: true,
    });

    const markerLoc = { lat: mapCenter.lat(), lng: mapCenter.lng() };
    this.props.dispatch(moveMarker(markerLoc));

    this._marker.addListener('drag', (event) => {
      const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      this.props.dispatch(moveMarker(location));
    });
  }

  _updateLayers(props) {
    const overlayMapTypes = this._map.overlayMapTypes;
    const layers = this._map.overlayMapTypes.getArray();
    const indicesToRemove = [];
    if (props.filterDate !== this.props.filterDate) {
      overlayMapTypes.clear();
    }

    _.each(layers, (layer, index) => {
      if (!_.find(props.activeLayers, { key: layer.name })) {
        indicesToRemove.push(index);
      }
    });
    _.each(indicesToRemove, index => overlayMapTypes.removeAt(index));

    _.each(props.activeLayers, layer => {
      if (!_.find(layers, { name: layer.key })) {
        overlayMapTypes.push(layer.getLayer(props.filterDate));
      }
    });
  }

  _updateCurrentLocation(props) {
    const isLocationLoaded = _.isNumber(props.Location.lon) &&
      _.isNumber(props.Location.lat);
    const isMapCentered = props.WorldMap.Location.isMapCentered;

    if (isMapCentered && isLocationLoaded) {
      const location = {
        lng: props.Location.lon,
        lat: props.Location.lat,
      };
      this._marker.setPosition(location);
      this.props.dispatch(moveMarker(location));
      this._map.setCenter(location);
      this._map.setZoom(13);
    }
  }

  updateSymptoms(symptoms, areSymptomsVisible) {
    const data = symptoms.map(symptom => {
      const [lng, lat] = symptom.coords;
      return {
        location: new google.maps.LatLng(lat, lng),
        weight: symptom.grade,
      };
    });

    this.symptomLayer.setData(data);
    this.symptomLayer.setMap(areSymptomsVisible ? this._map : null);
  }

  _centerMapClick() {
    this.props.dispatch(centerMap());
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
        <button className='btn' onClick={ this._centerMap } > Center map </button>
      </div>
    );
  }
}

export default createComponent(WorldMap, {
  reduxConfig: {
    mapStateToProps: state => state,
  },
});
