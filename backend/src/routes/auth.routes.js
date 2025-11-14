const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");
const { resendLimiter } = require("../middlewares/resendLimiter.middlewares");
const validate = require("../middlewares/validate.middlewares");
const {
  userRegisterSchema,
  foodPartnerRegisterSchema,
  loginSchema,
  resendVerificationSchema,
} = require("../validation/all.validation");

const router = express.Router();

// User routes
router.post(
  "/user/register",
  validate(userRegisterSchema),
  authController.registerUser
);
router.post("/user/login", validate(loginSchema), authController.loginUser);
router.get("/user/logout", authController.logoutUser);

// Food Partner routes
router.post(
  "/food-partner/register",
  validate(foodPartnerRegisterSchema),
  authController.registerFoodPartner
);
router.post(
  "/food-partner/login",
  validate(loginSchema),
  authController.loginFoodPartner
);
router.get("/food-partner/logout", authController.logoutFoodPartner);

// Email verification route
router.get("/verify-email", authController.verifyEmail);
router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  resendLimiter,
  authController.resendVerificationEmail
);

//to get all user and food-partner
router.get(
  "/me",
  authMiddlewares.authenticateAny,
  authController.getCurrentUser
);

module.exports = router;
