import mongoose from 'mongoose';

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

export default mongoose.model('ReportedSymptom', ReportedSymptomSchema);
