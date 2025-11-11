const rateLimit = require("express-rate-limit");

// 1) Limit how often an IP can trigger sending email
const sendEmailLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // max 3 tries per 5 min
  message: {
    type: "warning",
    message: "Too many email attempts. Try again later.",
  },
  standardHeaders: true,
});

// 2) Limit how often verification link can be opened
const verifyEmailLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 attempts per minute
  message: {
    type: "warning",
    message: "Too many requests. Slow down.",
  },

  standardHeaders: true,
});

module.exports = { sendEmailLimiter, verifyEmailLimiter };
