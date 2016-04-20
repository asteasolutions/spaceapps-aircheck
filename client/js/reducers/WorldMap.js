import _ from 'lodash';
import * as ActionTypes from '../constants/ActionTypes';
import Layers from '../utils/layers';

const defaultState = {
  layers: [],
};

export default function (state = defaultState, action) {
  console.log('state', state);
  switch (action.type) {
    case ActionTypes.TOGGLE_LAYER: {
      let layers;
      if (_.includes(state.layers, { key: action.key })) {
        layers = _.remove(state.layers, {
          key: action.key,
        });
      } else {
        const layer = _.find(Layers, { key: action.key });
        layers = _.clone(state.layers);
        layers.push(layer);
      }
      return { ...state, layers };
    }
    default:
      return state;
  }
}
