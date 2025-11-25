const cartDao = require("../dao/cart.dao");
const { Types } = require("mongoose");

async function addToCart(req, res) {
  try {
    const userId = req.user._id;
    const { foodId, quantity } = req.body;
    const fixedQuantity = Number(quantity);

    if (!Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({
        type: "error",
        message: "Invalid FoodId",
      });
    }
    if (isNaN(fixedQuantity) || fixedQuantity < 1) {
      return res.status(400).json({
        type: "error",
        message: "Quantity must be a number greater than or equal to 1",
      });
    }

    const cart = await cartDao.addToCart(userId, foodId, fixedQuantity);
    return res.status(200).json({
      type: "success",
      message: "Food item added to cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      type: "error",
      message: "Failed to add Cart",
      error: error.message,
    });
  }
}

async function removeFromCart(req, res) {
  try {
    const userId = req.user._id;
    const { foodId } = req.body;

    if (!Types.ObjectId.isValid(foodId)) {
      return res
        .status(400)
        .json({ type: "error", message: "Invalid Food ID" });
    }

    const cart = await cartDao.removeFromCart(userId, foodId);
    return res.status(200).json({
      type: "success",
      message: "Item removed from Cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      type: "error",
      message: "Failed to remove Item",
      error: error.message,
    });
  }
}

async function updateQuantity(req, res) {
  try {
    const userId = req.user._id;
    const { foodId, quantity } = req.body;
    const fixedQuantity = Number(quantity);

    if (!Types.ObjectId.isValid(foodId)) {
      return res
        .status(400)
        .json({ type: "error", message: "Invalid Food ID" });
    }

    if (!fixedQuantity || fixedQuantity < 1) {
      return res.status(400).json({
        type: "error",
        message: "Quantity must be at least 1",
      });
    }

    const cart = await cartDao.updateQuantity(userId, foodId, fixedQuantity);
    if (!cart) {
      return res.status(404).json({
        type: "error",
        message: "Food item not found in cart. Please add first.",
      });
    }
    return res.status(200).json({
      type: "success",
      message: "Quantity updated successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      type: "error",
      message: "Failed to Update Quantity",
      error: error.message,
    });
  }
}

async function getCart(req, res) {
  try {
    const userId = req.user._id;
    const cart = await cartDao.getUserCart(userId);

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        type: "info",
        message: "Cart is empty",
        cart: [],
      });
    }

    return res.status(200).json({
      type: "success",
      message: "Cart Fetched Successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      type: "error",
      message: "Failed to fetched",
      error: error.message,
    });
  }
}

async function clearCart(req, res) {
  try {
    const userId = req.user._id;
    await cartDao.clearCart(userId);

    return res.status(200).json({
      type: "success",
      message: "Cart cleared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      type: "error",
      message: "Failed to clear Cart",
      error: error.message,
    });
  }
}

module.exports = {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCart,
  clearCart,
};
