const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromptSchema = new Schema(
  {
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
    storyline: [{
      type: Schema.Types.ObjectId,
      ref: "Storyline",
      required: true,
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prompt", PromptSchema);
