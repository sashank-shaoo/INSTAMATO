// middlewares/resendLimiter.js
const rateLimit = require("express-rate-limit");

const resendLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 4, // 4 resend requests per IP
  message: {
    type: "warning",
    message: "Too many resend attempts. Please wait a minute.",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
  standardHeaders: true,
});

module.exports = {resendLimiter};
