import {
  CENTER_MAP,
  MOVE_MAP,
} from '../constants/ActionTypes';

export function centerMap() {
  return {
    type: CENTER_MAP,
  };
}

export function moveMap() {
  return {
    type: MOVE_MAP,
  };
}
