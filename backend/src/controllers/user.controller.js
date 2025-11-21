const userDao = require("../dao/user.dao");

async function getUser(req, res) {
  try {
    const userId = req.user._id || req.user.id;
    const user = await userDao.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        type: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      type: "success",
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      type: "error",
      message: "Failed to fetch user",
      error: error.message,
    });
  }
}

module.exports = { getUser };
