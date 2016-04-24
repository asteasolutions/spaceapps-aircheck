import {
  CENTER_MAP,
  MOVE_MAP,
  MOVE_MARKER,
  REQUEST_TILE_COORDINATES,
  TILE_COORDINATES_AVAILABLE,
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

export function requestTileCoordinates() {
  return {
    type: REQUEST_TILE_COORDINATES,
  };
}

export function tileCoordinatesAvailable(tileCoordinates) {
  return {
    type: TILE_COORDINATES_AVAILABLE,
    tileCoordinates,
  };
}
