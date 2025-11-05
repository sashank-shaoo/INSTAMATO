const express = require("express");
const router = express.Router();
const foodPartnerController = require("../controllers/food-partner.controller");
const authController = require("../controllers/auth.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");

router.get("/", foodPartnerController.getAllFoodPartner);
//api/food-partner/:id - get food partner profile [Protected route - food partner/user]
router.get(
  "/:id",
  authMiddlewares.authenticateFoodPartner,
  authMiddlewares.authenticateUser,
  foodPartnerController.getFoodPartnerById
);
//update food-partner
router.put(
  "/:id/edit",
  authMiddlewares.authenticateFoodPartner,
  authController.updateFoodPartner
);

module.exports = router;
