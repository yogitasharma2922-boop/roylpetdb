const env = require("../config/env");
const logger = require("../config/logger");
const { sendError } = require("../utils/apiResponse");

const errorHandler = (err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = status === 500 ? "Server error" : err.message || "Request failed";
  const details = env.isProd ? undefined : err.details || err.stack || err.message;

  logger.error("%s", err.stack || err.message || err);
  sendError(res, status, message, details);
};

module.exports = errorHandler;
