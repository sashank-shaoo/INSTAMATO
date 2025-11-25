const cartModel = require("../models/cart.model");
const foodModel = require("../models/foodItem.model");

async function addToCart(userId, foodId, quantity = 1) {
  quantity = Number(quantity);
  if (isNaN(quantity) || quantity < 1) throw new Error("Invalid quantity");
  const food = await foodModel.findById(foodId);
  if (!food) throw new Error("Food item not found");

  let cart = await cartModel.findOne({ user: userId });

  if (!cart) {
    cart = await cartModel.create({
      user: userId,
      items: [{ food: foodId, quantity, priceSnapshot: food.price }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.food.toString() === foodId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ food: foodId, quantity, priceSnapshot: food.price });
    }
  }

  await cart.save();
  return cart;
}

async function removeFromCart(userId, foodId) {
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter((item) => item.food.toString() !== foodId);
  await cart.save();
  return cart;
}

async function updateQuantity(userId, foodId, quantity) {
  if (quantity < 1) throw new Error("Quantity must be at least 1");

  const cart = await cartModel.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find((i) => i.food.toString() === foodId);
  if (!item) return null;

  item.quantity = quantity;
  await cart.save();
  return cart;
}

async function getUserCart(userId) {
  return await cartModel
    .findOne({ user: userId })
    .populate("items.food", "name image price"); // Only required fields
}

async function clearCart(userId) {
  return await cartModel.findOneAndDelete({ user: userId });
}

module.exports = {
  addToCart,
  removeFromCart,
  updateQuantity,
  getUserCart,
  clearCart,
};
