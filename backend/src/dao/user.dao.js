const userModel = require("../models/user.model");

//  Fetch user by email (excluding password)
async function getUserByEmail(email) {
  try {
    const user = await userModel.findOne({ email }).select("-password");
    if(!user){
      throw new Error("User not found with Email");
    }
    return user;
  } catch (error) {
    throw new Error("Failed to fetch user: " + error.message);
  }
}

//  Fetch user by email (including password for authentication)
async function getUserByEmailWithPassword(email) {
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("User not found with Email");
    }
    return user;
  } catch (error) {
    throw new Error("Failed to fetch user: " + error.message);
  }
}
//  Create new user
async function createUser(data) {
  try {
    const user = await userModel.create(data);
    return user;
  } catch (error) {
    throw new Error("Failed to create user: " + error.message);
  }
}

// Fetch user by ID  also exclude password
async function getUserById(id) {
  try {
    const user = await userModel.findById(id).select("-password");
    if (!user) {
      throw new Error("User not found with ID");
    }
    return user;
  } catch (error) {
    throw new Error("Failed to fetch user by ID: " + error.message);
  }
}

//Update User 
async function updateUser(id, data) {
  try{
    const user = await userModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
      return user;
  }catch(error){
    throw new Error("Failed to Update User :" + error.message);
  }
}
module.exports = {
  getUserByEmail,
  getUserByEmailWithPassword,
  createUser,
  getUserById,
  updateUser
};
