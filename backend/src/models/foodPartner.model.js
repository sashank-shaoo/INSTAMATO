const mongoose = require("mongoose");

const foodPartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [4, "Name must be at least 4 characters long"],
    },

    contactName: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },

    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verificationTokenExpires: Date,
    verificationLastSent: Number,
  },
  { timestamps: true }
);
foodPartnerSchema.index(
  { verificationTokenExpires: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("foodPartner", foodPartnerSchema);
