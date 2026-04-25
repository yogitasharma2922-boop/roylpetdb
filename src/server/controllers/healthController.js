const env = require("../config/env");
const { sendSuccess } = require("../utils/apiResponse");

const health = (_req, res) => sendSuccess(res, { ok: true, env: env.NODE_ENV });

module.exports = { health };
