import mongoose from 'mongoose';

const MODEL_NAME = 'TileInfo';

const TileInfoSchema = new mongoose.Schema({
  coords: {
    x: { type: Number },
    y: { type: Number },
  },
  zoom: { type: Number },
  date: { type: Date },
  layer: { type: String },
  sampleValue: { type: Number },
});

export default mongoose.model(MODEL_NAME, TileInfoSchema);
