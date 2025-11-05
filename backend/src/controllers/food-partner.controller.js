const foodDao = require("../dao/foodItem.dao");
const foodPartnerDao = require("../dao/foodPartner.dao");

async function getFoodPartnerById(req, res) {
  try {
    const { id } = req.params;

    const foodPartner = await foodPartnerDao.foodPartnerById(id);
    const foodItems = await foodDao.getFoodItemsByPartner(id);

    if (!foodPartner) {
      return res.status(404).json({
        message: "Food Partner not found",
      });
    }

    res.status(200).json({
      message: "Food Partner fetched successfully",
      foodPartner: {
        ...foodPartner.toObject(),
        foodItems: foodItems,
      },
    });
  } catch (error) {
    console.error("Error Fetching foodPartner:", error);
    res.status(500).json({
      message: "Failed to fetch foodPartner",
      error: error.message,
    });
  }
}

async function getAllFoodPartner(req, res) {
  try {
    const foodPartners = await foodPartnerDao.getAllFoodPartners();

    if (!foodPartners || foodPartners.length === 0) {
      return res.status(404).json({ message: "No food partners found" });
    }

    res.status(200).json({
      message: "Food partners fetched successfully",
      data: foodPartners,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = { getFoodPartnerById, getAllFoodPartner };
