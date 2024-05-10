import mongoose, { mongo } from "mongoose";

const placeSchema = mongoose.Schema({
  cityName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
  position: [
    {
      lng: {
        type: Number,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Place = mongoose.model("Place", placeSchema);
export default Place;
