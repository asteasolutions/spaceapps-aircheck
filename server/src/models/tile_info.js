import mongoose from 'mongoose';

const MODEL_NAME = 'TileInfo';

const TileInfoSchema = new mongoose.Schema({
  x: { type: Number },
  y: { type: Number },
  zoom: { type: Number },
  date: {
    year: { type: Number },
    month: { type: Number },
    day: { type: Number },
  },
  layer: { type: String },
  sampleValue: { type: Number },
});

export default mongoose.model(MODEL_NAME, TileInfoSchema);
