const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Without user you can't do oprations"],
  },
  items: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: [true, "Food Required"],
      },
      quantity: { type: Number, default: 1, min: 1 },
      priceSnapshot: { type: Number, required: true }, // food.price at the time
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

const cartModel = mongoose.model("cart", cartSchema);

module.exports = cartModel;
