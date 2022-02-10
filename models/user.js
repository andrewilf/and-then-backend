const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      default: "basic",
    },
    followedPrompts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Prompt",
      },
    ],
    ownedPrompts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Prompt",
      },
    ],
    ownedNodes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Node",
      },
    ],
    img: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", UserSchema);
