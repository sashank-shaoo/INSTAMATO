const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");

const router = express.Router();

// User routes
router.post("/user/register", authController.registerUser );
router.post("/user/login", authController.loginUser);
router.get("/user/logout", authController.logoutUser );

// Food Partner routes
router.post("/food-partner/register", authController.registerFoodPartner);
router.post("/food-partner/login", authController.loginFoodPartner);
router.get("/food-partner/logout", authController.logoutFoodPartner);

// Email verification route
router.get("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerificationEmail);


//to get all user and food-partner
router.get("/me", authMiddlewares.authenticateAny, authController.getCurrentUser);


module.exports = router;