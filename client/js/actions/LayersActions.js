import {
  TOGGLE_LAYER, TOGGLE_SYMPTOMS_LAYER, CHANGE_DATE, LAYERS_TOGGLED,
} from '../constants/ActionTypes';

export function toggleLayer(key) {
  return {
    type: TOGGLE_LAYER,
    key,
  };
}

export function toggleSymptomsLayer() {
  const type = TOGGLE_SYMPTOMS_LAYER;
  return { type };
}

export function changeDate(filterDate) {
  const type = CHANGE_DATE;
  return { type, filterDate };
}

export function layersToggled() {
  return {
    type: LAYERS_TOGGLED,
  };
}
