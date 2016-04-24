import _ from 'lodash';
import Relay from 'react-relay';
import AddReportedSymptomMutation from '../data/mutations/AddReportedSymptomMutation';
import symptoms from '../utils/symptoms';

const defaultBounds = {
  latMin: 42.6,
  latMax: 42.8,
  lngMin: 23.2,
  lngMax: 23.45,
};
function generateSymptomData(bounds = defaultBounds) {
  const category = _.sample(symptoms.categories);
  const name = _.sample(symptoms.types.get(category));
  const grade = _.random(1, 3);
  const lat = _.random(bounds.latMin, bounds.latMax);
  const lon = _.random(bounds.lngMin, bounds.lngMax);
  return {
    category,
    name,
    grade,
    lat,
    lon,
  };
}

const ZONES = [
  {
    intensity: 'low',

  },
  {
    intensity: 'medium',
  },
  {
    intensity: 'high',
    zones: [
      {
        latMax: 43,
        latMin: 42.90,
        lngMin: 23,
        lngMax: 23.65,
      },
      {
        latMax: 42.90,
        latMin: 42.85,
        lngMin: 23.65,
        lngMax: 23.95,
      },
      {
        latMax: 42.80,
        latMin: 42.75,
        lngMin: 24,
        lngMax: 24.35,
      },
      {
        latMax: 42.70,
        latMin: 42.65,
        lngMin: 24.35,
        lngMax: 24.70,
      },

      {
        latMax: 43.25,
        latMin: 43.20,
        lngMin: 23.10,
        lngMax: 23.30,
      },
      {
        latMax: 43.20,
        latMin: 43.15,
        lngMin: 23.30,
        lngMax: 23.75,
      },
      {
        latMax: 43.15,
        latMin: 43,
        lngMin: 23.75,
        lngMax: 24,
      },
      {
        latMax: 43,
        latMin: 42.90,
        lngMin: 23.75,
        lngMax: 24.70,
      },
      {
        latMax: 42.90,
        latMin: 42.85,
        lngMin: 24.70,
        lngMax: 24.80,
      },
    ],
  },
];


export function generateDummyData() {
  console.log('Generating');

  // for (let i = 0; i < 10; i++) {
  //   const data = generateSymptomData();
  //   Relay.Store.commitUpdate(new AddReportedSymptomMutation(data));
  // }

  _.each(ZONES[2].zones, function (bounds) {
    for (let i = 0; i < 5; i++) {
      const data = generateSymptomData(bounds);
      Relay.Store.commitUpdate(new AddReportedSymptomMutation(data));
    }
  });

  console.log('Generated');
}
