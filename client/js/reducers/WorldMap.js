import * as ActionTypes from '../constants/ActionTypes';
import { combineReducers } from 'redux';
import Layers from './Layers';

const defaultState = {
  isMapCentered: true,
};

function Location(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.CENTER_MAP:
      return { ...state, isMapCentered: true };
    case ActionTypes.MOVE_MAP:
      return { ...state, isMapCentered: false };
    case ActionTypes.MOVE_MARKER:
      return {
        ...state,
        dropPin: {
          ...action.location,
        },
      };
    default:
      return state;
  }
}

export default combineReducers({
  Layers,
  Location,
});
