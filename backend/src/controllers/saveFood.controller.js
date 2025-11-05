const saveFoodDao = require("../dao/saveFood.dao");

async function saveFoodItem(req, res) {
  try {
    const userId = req.user?._id;
    const { foodId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: login first" });
    }
    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    const existingSave = await saveFoodDao.findSave({
      user: userId,
      food: foodId,
    });
    let result;

    if (existingSave) {
      result = await saveFoodDao.deleteSavedFoodItem(userId, foodId);
    } else {
      result = await saveFoodDao.saveFoodItem(userId, foodId);
    }

    const { saved, bookMarkCount } = result;

    res.status(200).json({
      saved,
      bookMarkCount,
      message: saved ? "Food saved successfully" : "Food unsaved successfully",
    });
  } catch (error) {
    console.error("Error in saveFoodItem:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}


async function getSavedFoods(req, res) {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: login first" });
    }

    const savedFoods = await saveFoodDao.findSavedFoods(userId);

    if (!savedFoods || !savedFoods.length) {
      return res
        .status(200)
        .json({ message: "No saved videos found", foodItems: [] });
    }

    res.status(200).json({
      message: "Saved videos fetched successfully",
      foodItems: savedFoods,
    });
  } catch (error) {
    console.error("Error in getSavedFoods:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = {
  saveFoodItem,
  getSavedFoods,
};
