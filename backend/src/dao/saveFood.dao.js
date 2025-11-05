const saveModel = require("../models/saveItem.model");
const foodModel = require("../models/foodItem.model");

async function findSave(filter) {
  return await saveModel.findOne(filter);
}

async function findSavedFoods(userId) {
  try {
    const savedItems = await saveModel
      .find({ user: userId })
      .populate({
        path: "food",
        populate: { path: "foodPartner", select: "name" },
      })
      .lean();

    return savedItems.map((item) => item.food);
  } catch (error) {
    throw new Error(
      `Failed to findSavedFoods: ${error.name} - ${error.message}`
    );
  }
}


async function saveFoodItem(userId, foodId) {
  try {
    const existingSave = await findSave({ user: userId, food: foodId });
    if (existingSave) {
      const foodDoc = await foodModel.findById(foodId);
      return { saved: false, bookMarkCount: foodDoc.bookMarkCount || 0 };
    }
    await saveModel.create({ user: userId, food: foodId });
    const updatedFood = await foodModel.findByIdAndUpdate(
      foodId,
      { $inc: { bookMarkCount: 1 } },
      { new: true }
    );
    return { saved: true, bookMarkCount: updatedFood.bookMarkCount };
  } catch (error) {
    throw new Error(`Failed to saveItem: ${error.name} - ${error.message}`);
  }
}

async function deleteSavedFoodItem(userId, foodId) {
  try {
    const deleted = await saveModel.findOneAndDelete({
      user: userId,
      food: foodId,
    });
    if (!deleted) {
      const foodDoc = await foodModel.findById(foodId);
      return { saved: false, bookMarkCount: foodDoc.bookMarkCount };
    }

    const updatedFood = await foodModel.findByIdAndUpdate(
      foodId,
      { $inc: { bookMarkCount: -1 } },
      { new: true }
    );

    return { saved: false, bookMarkCount: updatedFood.bookMarkCount };
  } catch (error) {
    throw new Error(`Failed to deleteItem: ${error.name} - ${error.message}`);
  }
}


module.exports = {
  saveFoodItem,
  deleteSavedFoodItem,
  findSave,
  findSavedFoods,
};
