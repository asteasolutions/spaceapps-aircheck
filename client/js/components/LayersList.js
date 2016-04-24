import _ from 'lodash';
import React, { Component } from 'react';
import createComponent from '../utils/createComponent';
import { toggleLayer, toggleSymptomsLayer } from '../actions/LayersActions';
import { ButtonGroup, Button } from 'react-bootstrap';

class LayersList extends Component {

  constructor(props) {
    super(props);
    this._onToggleLayer = this._onToggleLayerClick.bind(this);
  }

  _onToggleSymptomsClick() {
    this.props.dispatch(toggleSymptomsLayer());
  }

  _onToggleLayerClick(key) {
    this.props.dispatch(toggleLayer(key));
  }

  render() {
    const { activeLayers, availableLayers, areSymptomsVisible } = this.props;
    const layersStatus = _(availableLayers)
      .keyBy(layer => layer.key)
      .mapValues(layer => _.includes(activeLayers, layer))
      .value();

    return (
      <div>
        <ButtonGroup className='btn-group-vertical'>
          {
            this.props.availableLayers.map(layer =>
              <Button key={ layer.key } active={ layersStatus[layer.key] }
                onClick={ () => this._onToggleLayer(layer.key) }>
                { layer.name }
              </Button>
            )
          }
          <Button className='btn btn-success'
            active={ areSymptomsVisible }
            onClick={ this._onToggleSymptomsClick.bind(this) }>
              Symptoms
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default createComponent(LayersList, {
  reduxConfig: {
    mapStateToProps: state => state.WorldMap.Layers,
  },
});
