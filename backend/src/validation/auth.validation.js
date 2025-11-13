const joi = require("joi");

// Registration validation schema
const userRegisterSchema = joi.object({
  fullName: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
//food partner registration can have additional fields if needed
const foodPartnerRegisterSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  contactName: joi.string().min(3).max(30).required(),
  phone: joi
    .string()
    .pattern(/^\d{10}$/)
    .required(),
  address: joi.string().min(5).max(100).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

// Login validation schema for users and food partners
const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

// Resend verification email schema
const resendVerificationSchema = joi.object({
  email: joi.string().email().required(),
});

// Verify email schema
const verifyEmailSchema = joi.object({
  token: joi.string().required(),
});

// Video upload validation schema
const videoSchema = joi.object({
  title: joi.string().min(5).max(100).required(),
  description: joi.string().min(10).max(500).required(),
});
module.exports = {
  userRegisterSchema,
  foodPartnerRegisterSchema,
  loginSchema,
  resendVerificationSchema,
  verifyEmailSchema,
  videoSchema,
};
