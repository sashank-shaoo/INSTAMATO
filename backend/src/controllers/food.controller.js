const foodDao = require("../dao/foodItem.dao");
const storageService = require("../services/storage.services");
const imageUploadService = require("../services/image.services");
const likeDao = require("../dao/likeFood.dao");
const saveFoodDao = require("../dao/saveFood.dao");
const { v4: uuid } = require("uuid");

//__________CREATE FOOD ITEM__________//
async function createFoodItem(req, res) {
  try {
    // Validate video
    if (!req.videoFile) {
      return res.status(400).json({
        type: "error",
        message: "Video file is required",
      });
    }

    // Upload video to ImageKit
    const videoResult = await storageService.uploadVideo(
      req.videoFile.buffer, // IMPORTANT FIX
      `${uuid()}.mp4`
    );

    // Validate image
    const imageFile = req.imageFile;
    if (!imageFile) {
      return res.status(400).json({
        type: "error",
        message: "Food image is required",
      });
    }

    const imageUrl = imageFile.url || imageFile.secure_url;

    // Create food item
    const foodItem = {
      name: req.body.name,
      price: req.body.price,
      image: imageUrl,
      video: videoResult.url,
      description: req.body.description,
      foodPartner: req.foodPartner._id,
    };

    const createdFoodItem = await foodDao.createFoodItem(foodItem);

    return res.status(201).json({
      type: "success",
      message: "Food item created successfully",
      food: createdFoodItem,
    });
  } catch (error) {
    console.error("Error creating food item:", error);

    if (error.name === "ValidationError") {
      const firstMessage = Object.values(error.errors)[0].message;
      return res.status(422).json({
        type: "error",
        message: firstMessage,
      });
    }

    return res.status(500).json({
      type: "error",
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

    return res.status(200).json({
      type: "success",
      message: "Food items fetched successfully",
      foodItems: foodItemsWithLikeAndSaveStatus,
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    return res.status(500).json({
      type: "error",
      message: "Failed to fetch food items",
      error: error.message,
    });
  }
}

module.exports = {
  createFoodItem,
  getAllFoodItems,
};
