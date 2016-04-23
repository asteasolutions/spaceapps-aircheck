import { TOGGLE_LAYER, CHANGE_DATE } from '../constants/ActionTypes';

export function toggleLayer(key) {
  return {
    type: TOGGLE_LAYER,
    key,
  };
}

export function changeDate(filterDate) {
  const type = CHANGE_DATE;
  return { type, filterDate };
}
