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

    // Check if email exists
    const existing = await userDao.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({
        type: "error",
        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { rawToken, tokenHash, expires } = generateVerificationToken(24);

    const user = await userDao.createUser({
      fullName,
      email,
      password: hashedPassword,
      verificationToken: tokenHash,
      verificationTokenExpires: expires,
      isVerified: false,
    });

    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${rawToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email - InstaMato 🍔",
      html: `
        <h2>Welcome to InstaMato, ${fullName}! as a User</h2>
        <p>Click below to verify your email:</p>
        <a href="${verificationLink}" target="_blank"
           style="background:#00c4ff;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">
           Verify Email
        </a>
        <p>This link expires in 24 hours.</p>
      `,
    });

    return res.status(201).json({
      type: "success",
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Error registering user:", error);

    // ✅ HANDLE: Duplicate unique key error
    if (error.code === 11000) {
      return res.status(400).json({
        type: "error",
        message: "Email is already in use",
      });
    }

    // ✅ HANDLE: Mongoose validation errors
    if (error.name === "ValidationError") {
      const firstMessage = Object.values(error.errors)[0].message;
      return res.status(400).json({
        type: "error",
        message: firstMessage, // e.g. "Password must be at least 6 characters"
      });
    }

    // ✅ fallback
    return res.status(500).json({
      type: "error",
      message: "Failed to register user",
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
        .json({ type: "error", message: "Unauthorized access : Login first" });
    }

    if (data.email || data.password) {
      return res.status(400).json({
        type: "error",
        message: "Email and Password can't be changed here",
      });
    }
    const updateUser = await userDao.updateUser(userId, data);

    if (!updateUser) {
      return res.status(404).json({
        type: "error",
        message: "User not Found",
      });
    }

    res.status(200).json({
      type: "success",
      message: "User updated successfully",
      user: updateUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({
        type: "error",
        message: "Failed to update user",
        error: error.message,
      });
  }
}

//___________Login User _____________//

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userDao.getUserByEmailWithPassword(email);
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 86400000,
    });

    return res.status(200).json({
      message: "User login successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
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

    const existing = await foodPartnerDao.getFoodPartnerByEmail(email);
    if (existing) {
      return res
        .status(400)
        .json({ type: "error", message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { hashToken, rawToken, expires } = generateVerificationToken(0.1667);

    const partner = await foodPartnerDao.createFoodPartner({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      contactName,
      verificationToken: hashToken,
      verificationTokenExpires: expires,
      isVerified: false,
    });
    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${rawToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email - InstaMato Partner 🍔",
      html: `
        <h2>Welcome ${contactName || name}!</h2>
        <h2>We appreciate your interest in becoming a food partner.</h2>
        <p>Please verify your email to complete the registration process:</p>
        <a href="${verificationLink}" target="_blank"
           style="background:#00c4ff;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">
        Verify Email
        </a>
      `,
    });

    return res.status(201).json({
      type: "success",
      message: "FoodPartner registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Error registering partner:", error);
    // ✅ Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        type: "error",
        message: "Email already exists",
      });
    }

    // ✅ Mongoose validation errors
    if (error.name === "ValidationError") {
      const firstMessage = Object.values(error.errors)[0].message;
      return res.status(400).json({
        type: "error",
        message: firstMessage,
      });
    }

    // ✅ fallback
    return res.status(500).json({
      type: "error",
      message: "Failed to register partner",
    });
  }
}

//_____________Login FoodPartner_____________//

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    const partner = await foodPartnerDao.getFoodPartnerByEmailWithPassword(
      email
    );
    if (!partner)
      return res.status(401).json({ message: "Invalid email or password" });

    if (!partner.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const valid = await bcrypt.compare(password, partner.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: partner._id, role: "partner" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 86400000,
    });

    return res.status(200).json({
      message: "FoodPartner login successful",
      foodPartner: {
        _id: partner._id,
        name: partner.name,
        email: partner.email,
      },
    });
  } catch (error) {
    console.error("FoodPartner login error:", error);
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
        .json({ type: "warning", message: "Email or Password can't be changed here ." });
    }

    const updatePartner = await foodPartnerDao.updateFoodPartnerById(
      partnerId,
      data
    );

    if (!updatePartner) {
      return res
        .status(404)
        .json({ type: "error", message: "Food partner not found." });
    }
    res.status(200).json({
      type: "success",
      message: "FoodPartner Updated succefully",
      updatePartner,
    });
  } catch (error) {
    console.error("Error updating in food partner : ", error);
     if (error.name === "ValidationError") {
       return res.status(400).json({
         type: "error",
         message: Object.values(error.errors)[0].message,
       });
     }

     return res.status(500).json({
       type: "error",
       message: "Failed to update food partner",
     });
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
      type: "error",
      message: "Failed to fetch current user",
      error: error.message,
    });
  }
}
async function verifyEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Missing verification token");

    const tokenHash = generateVerificationToken.createHash(token);

    let account =
      (await userDao.getUserByVerificationToken(tokenHash)) ||
      (await foodPartnerDao.getFoodPartnerByVerificationToken(tokenHash));
    if (!account) return res.status(400).send("Invalid or expired token");

    if (account.verificationTokenExpires < Date.now()) {
      return res.status(400).send("Verification link expired");
    }

    account.isVerified = true;
    account.verificationToken = undefined;
    account.verificationTokenExpires = undefined;

    await account.save();

    return res.redirect(`${process.env.FRONTEND_URL}/verified-success`);
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).send("Verification failed");
  }
}
async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ type: "warning", message: "Email is required" });
    }

    // Check for User or Partner
    let account =
      (await userDao.getUserByEmail(email)) ||
      (await foodPartnerDao.getFoodPartnerByEmail(email));

    if (!account) {
      return res.status(404).json({ type: "error", message: "Account not found" });
    }

    if (account.isVerified) {
      return res.status(400).json({ type: "warning", message: "Email already verified" });
    }
    const now = Date.now();

    if (
      account.verificationLastSent &&
      now - account.verificationLastSent < 2 * 60 * 1000
    ) {
      return res.status(429).json({
        message: "Please wait 2 minutes before requesting again",
      });
    }

    // Generate fresh token
    const { hashToken, rawToken, expires } = generateVerificationToken();

    account.verificationToken = hashToken;
    account.verificationTokenExpires = expires;
    await account.save();

    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${rawToken}`;
    await sendEmail({
      to: email,
      subject: "Resend Verification - InstaMato 🍔",
      html: `
        <h2>Verify your email</h2>
        <p>You requested a new verification link:</p>
        <a href="${verificationLink}" target="_blank"
           style="background:#00c4ff;color:white;padding:10px 16px;border-radius:8px;text-decoration:none;">
           Verify Email
        </a>
        <p>This link expires in 24 hours.</p>
      `,
    });
    account.verificationLastSent = Date.now();
    await account.save();

    return res.status(200).json({
      type: "success",
      message: "New verification email sent",
    });
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).json({ type: "error", message: "Failed to resend verification email" });
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
  resendVerificationEmail,
};
