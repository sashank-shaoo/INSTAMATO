const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  foodPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "foodPartner",
    required: true,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  bookMarkCount : {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const foodModel = mongoose.model("food", foodItemSchema);

module.exports = foodModel;
