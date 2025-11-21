const foodDao = require("../dao/foodItem.dao");
const foodPartnerDao = require("../dao/foodPartner.dao");

async function getFoodPartnerById(req, res) {
  try {
    const { id } = req.params;

    const foodPartner = await foodPartnerDao.foodPartnerById(id);
    const foodItems = await foodDao.getFoodItemsByPartner(id);

    if (!foodPartner) {
      return res.status(404).json({
        type: "error",
        message: "Food Partner not found",
      });
    }

    return res.status(200).json({
      type: "success",
      message: "Food Partner fetched successfully",
      foodPartner: {
        ...foodPartner.toObject(),
        foodItems: foodItems,
      },
    });
  } catch (error) {
    console.error("Error Fetching foodPartner:", error);
    return res.status(500).json({
      type: "error",
      message: "Failed to fetch foodPartner",
      error: error.message,
    });
  }
}

async function getAllFoodPartner(req, res) {
  try {
    const foodPartners = await foodPartnerDao.getAllFoodPartners();

    if (!foodPartners || foodPartners.length === 0) {
      return res
        .status(404)
        .json({ type: "error", message: "No food partners found" });
    }

    return res.status(200).json({
      type: "success",
      message: "Food partners fetched successfully",
      data: foodPartners,
    });
  } catch (error) {
    return res.status(500).json({
      type: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = { getFoodPartnerById, getAllFoodPartner };
