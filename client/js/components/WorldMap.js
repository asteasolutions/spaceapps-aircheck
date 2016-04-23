import _ from 'lodash';
import React, { Component } from 'react';
import createComponent from '../utils/createComponent';
import { loadCurrentLocation } from '../actions/HomeActions';

class WorldMap extends Component {
  componentDidMount() {
    this._initMap();
  }

  componentWillReceiveProps(props) {
    const overlayMapTypes = this._map.overlayMapTypes;
    const layers = this._map.overlayMapTypes.getArray();
    const indicesToRemove = [];

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
        lat: 42.672,
        lng: 23.322,
      },
      zoom: 6,
      minZoom: 1,
      maxZoom: 6,
    });
  }

  render() {
    const style = {
      width: '600px',
      height: '400px',
      border: 'blue',
    };
    return (
      <div>
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
