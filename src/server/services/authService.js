const jwt = require("jsonwebtoken");
const env = require("../config/env");

const createToken = (user) => {
  const payload = { id: user.id, role: user.role };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

module.exports = { createToken };
