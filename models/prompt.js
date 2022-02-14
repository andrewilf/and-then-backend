const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromptSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    promptText: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storyline: [
      {
        type: Schema.Types.ObjectId,
        ref: "Storyline",
        required: true,
      },
    ],
    status: {
      type: String,
      required: true,
      default: "Ongoing",
    },
    rating: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    bannerURL: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prompt", PromptSchema);
