const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");
const authController = require("../controllers/auth.controller");
const saveFoodController = require("../controllers/saveFood.controller");
const validate = require("../middlewares/validate.middlewares");
const { userUpdateSchema } = require("../validation/all.validation");

router.get(
  "/profile",
  authMiddlewares.authenticateUser,
  userController.getUser
);
router.put(
  "/profile/edit",
  authMiddlewares.authenticateUser,
  validate(userUpdateSchema),
  authController.updateUser
);
router.get(
  "/profile/saved-reels",
  authMiddlewares.authenticateUser,
  saveFoodController.getSavedFoods
);
module.exports = router;
