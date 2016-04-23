import mongoose from 'mongoose';
import moment from 'moment';
import _ from 'lodash';

const MODEL_NAME = 'ReportedSymptom';

const ReportedSymptomSchema = new mongoose.Schema({
  name: {
    type: String,
    description: 'The type of symptom.',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: { type: String },
    coordinates: [Number],
  },
  grade: {
    type: Number,
  },
  category: {
    type: String,
  },
});

ReportedSymptomSchema.static('filter', function filter({ date, containment, ...match }) {
  const query = _.clone(match);
  if (date) {
    const fromTime = moment(date).startOf('day').toDate();
    const toTime = moment(date).endOf('day').toDate();
    query.date = {
      $gte: fromTime,
      $lte: toTime,
    };
  }
  if (containment) {
    const [p1, p3] = containment;
    const p2 = [p1[0], p3[1]];
    const p4 = [p3[0], p1[1]];
    query.location = {
      $geoWithin: {
        $geometry: {
          type: 'Polygon',
          coordinates: [[p1, p2, p3, p4, p1]],
        },
      },
    };
  }

  return new Promise((resolve, reject) => {
    this.find(query, (err, result) => (err ? reject(err) : resolve(result)));
  });
});

ReportedSymptomSchema.index({ location: '2dsphere' });

export default mongoose.model(MODEL_NAME, ReportedSymptomSchema);
