const crypto = require("crypto");

function generateVerificationToken() {
  const token = crypto.randomBytes(9).toString("hex");
  const expires = Date.now() + 1000 * 60 * 60 * 24; 
  return { token, expires };
}

module.exports = generateVerificationToken;
