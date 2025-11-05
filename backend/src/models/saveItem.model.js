const { default: mongoose } = require("mongoose");

const saveItemSchema = new mongoose.Schema(
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
saveItemSchema.index({ user: 1, food: 1 }, { unique: true });

const saveModel = mongoose.model("saveItem", saveItemSchema);

module.exports = saveModel;
