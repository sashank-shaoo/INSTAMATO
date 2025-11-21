const express = require("express");
const foodController = require("../controllers/food.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");
const likeController = require("../controllers/likes.controller");
const saveFoodController = require("../controllers/saveFood.controller");
const router = express.Router();
const validate = require("../middlewares/validate.middlewares");
const { globalLimiter } = require("../middlewares/rateLimit.middlewares");
const { foodItemSchema } = require("../validation/all.validation");
const videoUpload = require("../middlewares/videoUpload.middlewares");
const imageUpload = require("../middlewares/imageUpload.middlewares");

//Post /api/food  - create food item [protected route - food partner]
router.post(
  "/",
  globalLimiter,
  authMiddlewares.authenticateFoodPartner,
  videoUpload,
  imageUpload,
  validate(foodItemSchema),
  foodController.createFoodItem
);

// GET /api/food - get all food items [public route] for users
router.get(
  "/",
  authMiddlewares.authenticateUser,
  foodController.getAllFoodItems
);

// POST /api/food/like - like a food item [protected route - user]
router.post(
  "/:foodId/like",
  authMiddlewares.authenticateUser,
  likeController.likeFoodItem
);

//post /api/food/save - save a food item [protected route - user]
router.post(
  "/:foodId/save",
  authMiddlewares.authenticateUser,
  saveFoodController.saveFoodItem
);

module.exports = router;
