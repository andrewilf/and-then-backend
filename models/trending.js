const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrendingSchema = new Schema(
  {
    promptID: {
      type: String,
      required: true,
      unique: true,
    },
    trendScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trending", TrendingSchema);
