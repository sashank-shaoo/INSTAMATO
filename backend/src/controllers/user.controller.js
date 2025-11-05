const userDao = require("../dao/user.dao");

async function getUser(req, res) {
  try {
    const userId = req.user._id || req.user.id; 
    const user = await userDao.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
}

module.exports = { getUser };
