import {
  TOGGLE_LAYER,
} from '../constants/ActionTypes';

export function toggleLayer(key) {
  return {
    type: TOGGLE_LAYER,
    key,
  };
}
