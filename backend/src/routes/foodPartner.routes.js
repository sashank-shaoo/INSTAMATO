const express = require("express");
const router = express.Router();
const foodPartnerController = require("../controllers/food-partner.controller");
const authController = require("../controllers/auth.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");
const validate = require("../middlewares/validate.middlewares");
const { foodPartnerUpdateSchema } = require("../validation/all.validation");

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
  validate(foodPartnerUpdateSchema),
  authController.updateFoodPartner
);

module.exports = router;
