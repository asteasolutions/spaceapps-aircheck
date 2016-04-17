import {
  REQUEST_LOCATION,
  LOCATION_SUCCESS,
  LOCATION_ERROR,
} from '../constants/ActionTypes';

function requestLocation() {
  return { type: REQUEST_LOCATION };
}

function locationSuccess(location) {
  return {
    type: LOCATION_SUCCESS,
    location,
  };
}

function locationError(error) {
  return {
    type: LOCATION_ERROR,
    error,
  };
}

export function loadCurrentLocation() {
  return (dispatch) => {
    dispatch(requestLocation());
    navigator.geolocation.getCurrentPosition(
      (location) => {
        const { longitude: lon, latitude: lat } = location.coords;
        dispatch(locationSuccess({ lon, lat }));
      },
      (error) => dispatch(locationError(error.message))
    );
  };
}
