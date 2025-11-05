const likeModel = require("../models/likes.model");
const foodModel = require("../models/foodItem.model");

async function findLike(filter) {
  return await likeModel.findOne(filter);
}

async function findLikedFoods(userId) {
  const likedItems = await likeModel.find({ user: userId }).select("food");
  return likedItems.map((like) => like.food.toString());
}

// Create a like
async function createLike({ user, food }) {
  try {
    const existingLike = await likeModel.findOne({ user, food });
    if (existingLike) {
      const foodDoc = await foodModel.findById(food);
      return { like: existingLike, likesCount: foodDoc.likesCount || 0 };
    }
    await likeModel.create({ user, food });

    const updatedFood = await foodModel.findByIdAndUpdate(
      food,
      { $inc: { likesCount: 1 } },
      { new: true }
    );

    return { liked: true, likesCount: updatedFood.likesCount };
  } catch (error) {
    throw new Error(`Failed to create like: ${error.message}`);
  }
}

// Delete a like
async function deleteLike({ user, food }) {
  try {
    const deleted = await likeModel.findOneAndDelete({ user, food });
    if (!deleted) return { liked: false, likesCount: (await foodModel.findById(food)).likesCount };

    const updatedFood = await foodModel.findByIdAndUpdate(
      food,
      { $inc: { likesCount: -1 } },
      { new: true }
    );

    return { liked: false, likesCount: updatedFood.likesCount };
  } catch (error) {
    throw new Error(`Failed to delete like: ${error.message}`);
  }
}


module.exports = {
  createLike,
  deleteLike,
  findLike,
  findLikedFoods,
};
