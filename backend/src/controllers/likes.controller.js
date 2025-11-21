const likeDao = require("../dao/likeFood.dao");

async function likeFoodItem(req, res) {
  try {
    const userId = req.user._id;
    const { foodId } = req.params;

    if (!foodId)
      return res
        .status(400)
        .json({ type: "error", message: "Food ID required" });

    const existingLike = await likeDao.findLike({ user: userId, food: foodId });

    let liked, likesCount;

    if (existingLike) {
      const result = await likeDao.deleteLike({ user: userId, food: foodId });
      liked = false;
      likesCount = result.likesCount;
    } else {
      const result = await likeDao.createLike({ user: userId, food: foodId });
      liked = true;
      likesCount = result.likesCount;
    }

    return res.status(200).json({
      type: "success",
      liked,
      likesCount,
      message: liked ? "Liked successfully" : "Unliked successfully",
    });
  } catch (error) {
    console.error("Error in likeFoodItem:", error);
    return res.status(500).json({
      type: "error",
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = { likeFoodItem };
