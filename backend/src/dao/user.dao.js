const userModel = require("../models/user.model");

//  Fetch user by email (excluding password)
async function getUserByEmail(email) {
  return userModel.findOne({ email }).select("-password");
}

//  Fetch user by email (including password for authentication)
async function getUserByEmailWithPassword(email) {
  return userModel.findOne({ email }).select("+password");
}

//  Create new user
async function createUser(data) {
  return userModel.create(data);
}

// Fetch user by ID
async function getUserById(id) {
  return userModel.findById(id).select("-password");
}

// Update user
async function updateUser(id, data) {
  return userModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
}

async function getUserByVerificationToken(token) {
  return userModel.findOne({ verificationToken: token });
}

module.exports = {
  getUserByEmail,
  getUserByEmailWithPassword,
  createUser,
  getUserById,
  updateUser,
  getUserByVerificationToken,
};
