const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");

//add to cart
router.post("/add", authMiddlewares.authenticateUser, cartController.addToCart);

//Remove from cart
router.delete("/remove", authMiddlewares.authenticateUser, cartController.removeFromCart);

//Update cart quantity
router.put("/update", authMiddlewares.authenticateUser, cartController.updateQuantity);

//get cart by user
router.get("/", authMiddlewares.authenticateUser, cartController.getCart);

//Clear cart  [whole cart]
router.delete("/clear", authMiddlewares.authenticateUser, cartController.clearCart);

module.exports = router;