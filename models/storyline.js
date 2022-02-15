const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorylineSchema = new Schema(
  {
    prompt: {
      type: Schema.Types.ObjectId,
      ref: "Prompt",
    },
    storyNodes: [
      {
        type: Schema.Types.ObjectId,
        ref: "StoryNode",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    proposedNodes: [
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
