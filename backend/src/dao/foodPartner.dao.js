const foodPartnerModel = require("../models/foodPartner.model");

async function createFoodPartner(data) {
  return foodPartnerModel.create(data);
}

async function updateFoodPartnerById(id, data) {
  return foodPartnerModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
}

async function getFoodPartnerByEmail(email) {
  return foodPartnerModel.findOne({ email });
}

async function getFoodPartnerByEmailWithPassword(email) {
  return foodPartnerModel.findOne({ email }).select("+password");
}

async function foodPartnerById(id) {
  return foodPartnerModel.findById(id).select("-password");
}

async function getAllFoodPartners() {
  return foodPartnerModel.find({});
}

async function getFoodPartnerByVerificationToken(token) {
  return foodPartnerModel.findOne({ verificationToken: token });
}

module.exports = {
  getFoodPartnerByEmailWithPassword,
  createFoodPartner,
  updateFoodPartnerById,
  foodPartnerById,
  getAllFoodPartners,
  getFoodPartnerByEmail,
  getFoodPartnerByVerificationToken,
};
