const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent Duplicate Likes you gave by Db
likesSchema.index({ user: 1, food: 1 }, { unique: true });


const likeModel = mongoose.model("like", likesSchema);
module.exports = likeModel;
