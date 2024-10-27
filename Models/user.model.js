import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  likes: [
    {
      type: String,
    },
  ],
  collections: [
    {
      collectionName: {
        type: String,
        required: true,
      },
      artworks: [
        {
          type: String,
        },
      ],
    },
  ],
});

export default mongoose.model("User", userSchema);
