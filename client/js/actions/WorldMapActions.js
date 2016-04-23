import {
  CENTER_MAP,
  MOVE_MAP,
  MOVE_MARKER,
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

export function moveMarker(location) {
  return {
    type: MOVE_MARKER,
    location,
  };
}
