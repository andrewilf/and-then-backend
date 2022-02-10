const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoryNodeSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    PromptAttached: {
      type: Schema.Types.ObjectId,
      ref: "Prompt",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StoryNode", StoryNodeSchema);