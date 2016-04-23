import * as ActionTypes from '../constants/ActionTypes';
import { combineReducers } from 'redux';
import Layers from './Layers';

const defaultState = {
  isMapCentered: true,
};

function Location(state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.CENTER_MAP:
      return { isMapCentered: true };
    case ActionTypes.MOVE_MAP:
      return { isMapCentered: false };
    default:
      return state;
  }
}

export default combineReducers({
  Layers,
  Location,
});
