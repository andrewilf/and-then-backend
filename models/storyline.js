const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorylineSchema = new Schema(
  {
    prompt: {
      type: Schema.Types.ObjectId,
      ref: "Prompt",
      unique: true,
    },
    storyNodes: [
      {
        type: Schema.Types.ObjectId,
        ref: "StoryNode",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Storyline", StorylineSchema);
