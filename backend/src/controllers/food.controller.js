const foodDao = require("../dao/foodItem.dao");
const storageService = require("../services/storage.services");
const likeDao = require("../dao/likeFood.dao");
const saveFoodDao = require("../dao/saveFood.dao");
const { v4: uuid } = require("uuid");



//__________CREATE FOOD ITEM__________//
async function createFoodItem(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }
    if (!req.body.name) {
      return res.status(400).json({ message: "Food name is required" });
    }
    console.log(req.file);

    const uploadResult = await storageService.uploadVideo(
      req.file.buffer,
      `${uuid()}.mp4`
    );

    const foodItem = {
      name: req.body.name,
      video: uploadResult.url,
      description: req.body.description,
      foodPartner: req.foodPartner._id,
    };

    const createdFoodItem = await foodDao.createFoodItem(foodItem);

    res.status(201).json({
      success: true,
      message: "Food item created successfully",
      food: createdFoodItem,
    });
  } catch (error) {
    console.error("Error creating food item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create food item",
      error: error.message,
    });
  }
}

//______________GET ALL FOOD ITEMS______________//
async function getAllFoodItems(req, res) {
  try {
    const foodItems = await foodDao.getAllFoodItems();

    let likedFoodIds = [];
    let savedFoodIds = [];

    if (req.user?._id) {
      likedFoodIds = await likeDao.findLikedFoods(req.user._id);
      savedFoodIds = await saveFoodDao.findSavedFoods(req.user._id);
    }
    const likedSet = new Set(likedFoodIds.map(String));
    const savedSet = new Set(savedFoodIds.map(String));

    const foodItemsWithLikeAndSaveStatus = foodItems.map((f) => ({
      ...f.toObject(),
      isLikedByUser: likedSet.has(f._id.toString()),
      isSavedByUser: savedSet.has(f._id.toString()),
    }));

    res.status(200).json({
      message: "Food items fetched successfully",
      foodItems: foodItemsWithLikeAndSaveStatus,
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch food items",
      error: error.message,
    });
  }
}


module.exports = {
  createFoodItem,
  getAllFoodItems,
};
