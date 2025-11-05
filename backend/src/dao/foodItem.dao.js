const foodModel = require("../models/foodItem.model");

//create food item

async function createFoodItem(data) {
  try {
    const foodItem = await foodModel.create(data);
    return foodItem;
  } catch (error) {
    throw new Error("Failed to create food item: " + error.message);
  }
}

async function getAllFoodItems() {
  try {
    const foodItems = await foodModel
      .find({})
      .populate("foodPartner", "name")
      .sort({ createdAt: -1 });
    return foodItems;
  } catch (error) {
    throw new Error("Failed to fetch food items: " + error.message);
  }
}

async function getFoodItemsByPartner(id) {
  try {
    const foodItems = await foodModel.find({ foodPartner: id });
    return foodItems;
  } catch (error) {
    throw new Error("Failed to fetch food items by partner: " + error.message);
  }
}

module.exports = { createFoodItem, getAllFoodItems, getFoodItemsByPartner };
