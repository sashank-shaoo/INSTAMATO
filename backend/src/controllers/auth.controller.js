const foodPartnerDao = require("../dao/foodPartner.dao");
const userDao = require("../dao/user.dao");
const bcrypt = require("bcryptjs");
const sendEmail = require("../services/email.services");
const generateVerificationToken = require("../utils/generateVerificationToken");
const jwt = require("jsonwebtoken");

// -------------------USER AUTH CONTROLLERS-------------------//

//________Register User________//

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    const isUserAlredyExist = await userDao.getUserByEmail(email);

    if (isUserAlredyExist) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { Etoken, expires } = generateVerificationToken();

    const user = await userDao.createUser({
      fullName,
      email,
      password: hashedPassword,
      verificationToken: Etoken,
      verificationTokenExpires: expires,
      isVerified: false,
    });

    const token = jwt.sign(
      {
        id: user._id,
        role: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    // ✅ Send verification email
    const verificationLink = `http://localhost:5173/verify-email?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Verify your email - InstaMato 🍔",
      html: `
        <h2>Welcome to InstaMato, ${fullName}!</h2>
        <p>Click below to verify your email:</p>
        <a href="${verificationLink}" target="_blank"
          style="background:#00c4ff;color:#fff;padding:10px 16px;
          border-radius:8px;text-decoration:none;">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered Successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
}

//___________Update User____________//4
async function updateUser(req, res) {
  try {
    const userId = req.user?._id || req.user?.id;
    const data = req.body;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized access : Login first" });
    }

    if (data.email || data.password) {
      return res.status(400).json({
        message: "Email and Password can't be changed here",
      });
    }
    const updateUser = await userDao.updateUser(userId, data);

    if (!updateUser) {
      return res.status(404).json({
        message: "User not Found",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updateUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
}

//___________Login User _____________//

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userDao.getUserByEmailWithPassword(email);

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User login Successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//___________Logout User _____________//

async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "User logout successfully",
  });
}

//--------------------FOOD PARTNER AUTH CONTROLLERS-------------------//

//_____________Register FoodPartner_____________//

async function registerFoodPartner(req, res) {
  try {
    const { name, email, password, address, phone, contactName } = req.body;

    const isFoodPartnerAlreadyExist =
      await foodPartnerDao.getFoodPartnerByEmail(email);

    if (isFoodPartnerAlreadyExist) {
      return res.status(400).json({
        message: "FoodPartner alrady exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 15);
    const { Etoken, expires } = generateVerificationToken();

    const foodPartner = await foodPartnerDao.createFoodPartner({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      contactName,
      verificationToken: token,
      verificationTokenExpires: expires,
      isVerified: false,
    });
    const verificationLink = `http://localhost:5173/verify-email?token=${token}`;
    await sendEmail({
      to: email,
      subject: "Verify your email - InstaMato 🍔 (Food Partner)",
      html: `
        <h2>Welcome to InstaMato Partner Network, ${contactName || name}!</h2>
        <p>Click below to verify your email:</p>
        <a href="${verificationLink}" target="_blank"
          style="background:#00c4ff;color:#fff;padding:10px 16px;
          border-radius:8px;text-decoration:none;">Verify Email</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
    const token = jwt.sign(
      {
        id: foodPartner._id,
        role: "partner",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "FoodPartner registered Successfully",
      foodPartner: {
        _id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    console.error("Error registering food partner:", error);
    res.status(500).json({
      message: "Failed to register food partner",
      error: error.message,
    });
  }
}
//_____________Login FoodPartner_____________//

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    const foodPartner = await foodPartnerDao.getFoodPartnerByEmailWithPassword(
      email
    );

    if (!foodPartner) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      foodPartner.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        id: foodPartner._id,
        role: "partner",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "FoodPartner login Successfully",
      foodPartner: {
        _id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    console.error("Error logging in food partner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//_____________Logout FoodPartner_____________//
async function logoutFoodPartner(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "FoodPartner logout successfully",
  });
}

//_____________updata FoodPartner____________//
async function updateFoodPartner(req, res) {
  try {
    const partnerId = req.foodPartner?._id;
    const data = req.body;

    if (!partnerId) {
      return res.status(401).json({ message: "Unauthorized access." });
    }
    //i prevent email for better managment
    if (data.email || data.password) {
      return res
        .status(400)
        .json({ message: "Email or Password can't be changed here ." });
    }

    const updatePartner = await foodPartnerDao.updateFoodPartnerById(
      partnerId,
      data
    );

    if (!updatePartner) {
      return res.status(404).json({ message: "Food partner not found." });
    }
    res.status(200).json({
      message: "FoodPartner Updated succefully",
      updatePartner,
    });
  } catch (error) {
    console.error("Error updating in food partner : ", error);
    res.status(500).json({ message: error.message });
  }
}

//_____________Get Current User (User or Food Partner)____________//
async function getCurrentUser(req, res) {
  try {
    if (req.role === "user" && req.user) {
      return res.status(200).json({
        success: true,
        role: "user",
        profile: req.user,
      });
    }

    if (req.role === "partner" && req.foodPartner) {
      return res.status(200).json({
        success: true,
        role: "partner",
        profile: req.foodPartner,
      });
    }

    return res.status(404).json({ message: "Profile not found" });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({
      message: "Failed to fetch current user",
      error: error.message,
    });
  }
}
async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Missing verification token");

    // try user first, then partner
    let account = await userDao.getUserByVerificationToken(token);
    let type = "user";
    if (!account) {
      account = await foodPartnerDao.getFoodPartnerByVerificationToken(token);
      type = "partner";
    }
    if (!account) return res.status(400).send("Invalid or expired token");

    if (
      account.verificationTokenExpires &&
      account.verificationTokenExpires < Date.now()
    ) {
      return res.status(400).send("Verification link has expired");
    }

    account.isVerified = true;
    if (type === "user") account.isVaerified = true; // keep legacy flag in sync
    if (type === "partner") account.isVarified = true;

    account.verificationToken = undefined;
    account.verificationTokenExpires = undefined;
    await account.save();

    return res.redirect(`${process.env.FRONTEND_URL}/verified-success`);
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).send("Verification failed");
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  updateFoodPartner,
  getCurrentUser,
  verifyEmail,
};
