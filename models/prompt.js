const mongoosePaginate = require("mongoose-paginate-v2");
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
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
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
PromptSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Prompt", PromptSchema);
