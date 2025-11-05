const foodPartnerModel = require("../models/foodPartner.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authenticateFoodPartner(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access :: login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foodPartner = await foodPartnerModel.findById(decoded.id).select("-password");

    req.foodPartner = foodPartner;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token :: Unauthorized access",
    });
  }
}

async function authenticateUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access :: login first",
    });
  } 
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("-password"); 
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token :: Unauthorized access",
    });
  }
}

async function authenticateAny(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access :: login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "user") {
      const user = await userModel.findById(decoded.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      req.user = user;
      req.role = "user";
    } else if (decoded.role === "partner") {
      const foodPartner = await foodPartnerModel
        .findById(decoded.id)
        .select("-password");
      if (!foodPartner)
        return res.status(404).json({ message: "Food partner not found" });

      req.foodPartner = foodPartner;
      req.role = "partner";
    } else {
      return res.status(400).json({ message: "Invalid role in token" });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token :: Unauthorized access",
    });
  }
}

module.exports = { authenticateFoodPartner, authenticateUser, authenticateAny };