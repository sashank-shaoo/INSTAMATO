const rateLimit = require("express-rate-limit");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { type: "warning", message: "Too many requests. Try again later." },
  handler: (req, res, next, options) => {
    res
      .status(options.statusCode)
      .json(
        options.message || { type: "warning", message: "Rate limit exceeded." }
      );
  },
  standardHeaders: true,
});

module.exports = { globalLimiter };