import {
  TOGGLE_LAYER,
} from '../constants/ActionTypes';

export function toggleLayer(name) {
  return {
    type: TOGGLE_LAYER,
    name,
  };
}
