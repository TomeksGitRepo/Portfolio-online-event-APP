const mongoose = require("mongoose");

const movieInfoSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      unique: true,
      required: true,
    },
    markedAsLive: {
      type: Boolean,
    },
    markedAsMain: {
      type: Boolean,
    },
    markedAsNew: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.models.MovieInfo ||
  mongoose.model("MovieInfo", movieInfoSchema);
