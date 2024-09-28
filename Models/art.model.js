import mongoose from "mongoose";

const artSchema = new mongoose.Schema({
  artId: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  medium: {
    type: String,
  },
  dimensions: {
    type: String,
  },
  culture: {
    type: String,
  },
  period: {
    type: String,
  },
  imageUrl: { type: String },
  museum: { type: String },
});

export default mongoose.model("Art", artSchema);
