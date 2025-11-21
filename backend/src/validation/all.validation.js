const joi = require("joi");

// User Registration validation schema
const userRegisterSchema = joi.object({
  fullName: joi.string().min(3).max(30).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters long",
    "string.max": "Full name must be at most 30 characters long",
  }),

  email: joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),

  password: joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
});

// User update validation schema
const userUpdateSchema = joi.object({
  fullName: joi.string().min(3).max(30).messages({
    "string.min": "Full name must be at least 3 characters long",
    "string.max": "Full name must be at most 30 characters long",
  }),
});

// Food Partner Registration validation schema
const foodPartnerRegisterSchema = joi.object({
  name: joi.string().min(3).max(30).required().messages({
    "string.empty": "Business name is required",
    "string.min": "Business name must be at least 3 characters long",
    "string.max": "Business name must be at most 30 characters long",
  }),

  contactName: joi.string().min(3).max(30).required().messages({
    "string.empty": "Contact name is required",
    "string.min": "Contact name must be at least 3 characters long",
    "string.max": "Contact name must be at most 30 characters long",
  }),

  phone: joi
    .string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be 10 digits",
    }),

  address: joi.string().min(5).max(100).required().messages({
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters long",
    "string.max": "Address must be at most 100 characters long",
  }),

  email: joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),

  password: joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
});

// Food Partner update validation schema
const foodPartnerUpdateSchema = joi.object({
  name: joi.string().min(3).max(30).messages({
    "string.min": "Business name must be at least 3 characters long",
    "string.max": "Business name must be at most 30 characters long",
  }),
  contactName: joi.string().min(3).max(30).messages({
    "string.min": "Contact name must be at least 3 characters long",
    "string.max": "Contact name must be at most 30 characters long",
  }),
  phone: joi
    .string()
    .pattern(/^\d{10}$/)
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be 10 digits",
    }),

  address: joi.string().min(5).max(100).messages({
    "string.min": "Address must be at least 5 characters long",
    "string.max": "Address must be at most 100 characters long",
  }),
});

// Login validation schema
const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
  }),

  password: joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

// Resend verification email schema
const resendVerificationSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.empty": "Email is required to resend verification",
    "string.email": "Please enter a valid email address",
  }),
});

// Verify email schema
const verifyEmailSchema = joi.object({
  token: joi.string().required().messages({
    "string.empty": "Verification token is required",
  }),
});

// Video upload validation schema
const foodItemSchema = joi.object({
  name: joi.string().min(5).max(100).required().messages({
    "string.min": "Food Name be at least 5 characters long",
    "string.max": "Food Name be at most 100 characters long",
  }),
  price: joi.number().min(1).required().messages({
    "number.min": "Price must be at least 1",
  }),
  description: joi.string().min(10).max(500).required().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description must be at most 500 characters long",
  }),
});

module.exports = {
  userRegisterSchema,
  foodPartnerRegisterSchema,
  loginSchema,
  resendVerificationSchema,
  verifyEmailSchema,
  foodItemSchema,
  userUpdateSchema,
  foodPartnerUpdateSchema,
};
