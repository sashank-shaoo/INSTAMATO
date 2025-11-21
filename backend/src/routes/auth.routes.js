const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");
const { resendLimiter } = require("../middlewares/resendLimiter.middlewares");
const validate = require("../middlewares/validate.middlewares");
const {globalLimiter} = require("../middlewares/rateLimit.middlewares");
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
  globalLimiter,
  validate(userRegisterSchema),
  authController.registerUser
);
router.post("/user/login", globalLimiter, validate(loginSchema), authController.loginUser);
router.get("/user/logout", authController.logoutUser);

// Food Partner routes
router.post(
  "/food-partner/register",
  globalLimiter,
  validate(foodPartnerRegisterSchema),
  authController.registerFoodPartner
);
router.post(
  "/food-partner/login",
  globalLimiter,
  validate(loginSchema),
  authController.loginFoodPartner
);
router.get("/food-partner/logout", globalLimiter, authController.logoutFoodPartner);

// Email verification route
router.get("/verify-email",
   authController.verifyEmail);
router.post(
  "/resend-verification",
  globalLimiter,
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
