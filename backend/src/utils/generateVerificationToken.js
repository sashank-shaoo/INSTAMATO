const crypto = require("crypto");

function createHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateVerificationToken(expariesInHours = 24) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashToken = createHash(rawToken);
  const expires = Date.now() + 1000 * 60 * 60 * expariesInHours; // Default 24 hours
  return { rawToken, hashToken, expires };
}


module.exports = { generateVerificationToken , createHash };
