import * as ActionTypes from '../constants/ActionTypes';

const defaultState = {
  isLoading: false,
  error: null,
  lon: null,
  lat: null,
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case ActionTypes.REQUEST_LOCATION:
      return { ...state, isLoading: true };
    case ActionTypes.LOCATION_SUCCESS:
      return { ...action.location, error: null, isLoading: false };
    case ActionTypes.LOCATION_ERROR:
      return { ...state, error: action.error, isLoading: false };
    default:
      return state;
  }
}
