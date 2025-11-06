const foodPartnerModel = require("../models/foodPartner.model");

async function createFoodPartner(data) {
  try {
    const foodPartner = await foodPartnerModel.create(data);
    return foodPartner;
  } catch (error) {
    throw new Error("Failed to create food partner: " + error.message);
  }
}
async function updateFoodPartnerById(id, data) {
  try {
    const foodPartner = await foodPartnerModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    return foodPartner;
  } catch (error) {
    throw new Error("Failed to update food partner: " + error.message);
  }
}
async function getFoodPartnerByEmail(email) {
  try {
    const foodPartner = await foodPartnerModel.findOne({ email });
    if (!foodPartner) {
      throw new Error("Food partner not found with Email");
    }
    return foodPartner;
  } catch (error) {
    throw new Error("Failed to fetch food partner: " + error.message);
  }
}

//  Fetch food partner by email (including password for authentication)
async function getFoodPartnerByEmailWithPassword(email) {
  try {
    const foodPartner = await foodPartnerModel
      .findOne({ email })
      .select("+password");
      
    if (!foodPartner) {
      throw new Error("Food partner not found with Email");
    }

    return foodPartner;
  } catch (error) {
    throw new Error("Failed to fetch food partner: " + error.message);
  }
}
async function foodPartnerById(id) {
  try {
    const foodPartner = await foodPartnerModel.findById(id).select("-password");
      if (!foodPartner) {
      throw new Error("Food partner not found with ID");
    }
    return foodPartner;
  } catch (error) {
    throw new Error("Failed to fetch food partner: " + error.message);
  }
}
async function getAllFoodPartners() {
  try {
    const foodPartner = await foodPartnerModel.find({});
    return foodPartner;
  } catch (error) {
    throw new Error("Failed to fetch Food Partners : " + error.message);
  }
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
