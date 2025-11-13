const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true," Food item name is required"],
    trim: true,
    minlength: [5,"Food item name must be at least 5 characters long"],
  },
  video: {
    type: String,
    required: [true, "Video URL is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
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
