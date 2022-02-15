const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorylineSchema = new Schema(
  {
    promptAttached: {
      type: Schema.Types.ObjectId,
      ref: "Prompt",
    },
    storyNodes: [
      {
        type: Schema.Types.ObjectId,
        ref: "StoryNode",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Storyline", StorylineSchema);
