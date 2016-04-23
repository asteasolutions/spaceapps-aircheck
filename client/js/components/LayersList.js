import _ from 'lodash';
import React, { Component } from 'react';
import createComponent from '../utils/createComponent';
import { toggleLayer } from '../actions/LayersActions';

class LayersList extends Component {
  constructor(props) {
    super(props);

    this._onToggleLayer = this._onToggleLayerClick.bind(this);
  }

  _onToggleLayerClick(key) {
    this.props.dispatch(toggleLayer(key));
  }

  render() {
    const layersStatus = _.mapValues(_.keyBy(this.props.availableLayers, layer =>
      layer.key
    ), layer =>
      _.includes(this.props.activeLayers, layer)
    );

    return (
      <div>
        <h4>Select NASA Layer</h4>
        <ul>
          {
            this.props.availableLayers.map(layer =>
              <li key={ layer.key } >
                <label className='checkbox'>
                  <input
                    type='checkbox'
                    checked={ layersStatus[layer.key] }
                    onClick={ () => this._onToggleLayer(layer.key) }
                  />
                  { layer.name }
                </label>
              </li>
            )
          }
        </ul>
      </div>
    );
  }
}

export default createComponent(LayersList, {
  reduxConfig: {
    mapStateToProps: state => state.Layers,
  },
});
