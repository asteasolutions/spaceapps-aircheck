import _ from 'lodash';
import * as ActionTypes from '../constants/ActionTypes';
import Layers from '../utils/layers';

const defaultState = {
  availableLayers: Layers,
  activeLayers: [],
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.TOGGLE_LAYER: {
      let layers;
      if (_.find(state.activeLayers, { key: action.key })) {
        layers = _.reject(state.activeLayers, { key: action.key });
      } else {
        const layer = _.find(Layers, { key: action.key });
        layers = _.clone(state.activeLayers);
        layers.push(layer);
      }
      return { ...state, activeLayers: layers };
    }
    default:
      return state;
  }
}
