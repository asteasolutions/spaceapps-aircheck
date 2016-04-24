import _ from 'lodash';
import * as ActionTypes from '../constants/ActionTypes';
import Layers from '../utils/layers';

const defaultState = {
  availableLayers: Layers,
  activeLayers: [],
  layersToggled: false,
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
      return {
        ...state,
        layersToggled: true,
        activeLayers: layers,
      };
    }

    case ActionTypes.TOGGLE_SYMPTOMS_LAYER: {
      return {
        ...state,
        layersToggled: true,
        areSymptomsVisible: !state.areSymptomsVisible,
      };
    }

    case ActionTypes.LAYERS_TOGGLED:
      return { ...state, layersToggled: false };

    case ActionTypes.CHANGE_DATE: {
      const { filterDate } = action;
      return { ...state, filterDate, layersToggled: true };
    }

    default:
      return state;
  }
}
