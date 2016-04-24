import _ from 'lodash';
import * as ActionTypes from '../constants/ActionTypes';
import Layers from '../utils/layers';

const defaultState = {
  availableLayers: Layers,
  activeLayers: [],
  areSymptomsVisible: false,
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

    case ActionTypes.TOGGLE_SYMPTOMS_LAYER: {
      return {
        ...state,
        areSymptomsVisible: !state.areSymptomsVisible,
      };
    }

    case ActionTypes.CHANGE_DATE: {
      const { filterDate } = action;
      return { ...state, filterDate };
    }

    default:
      return state;
  }
}
