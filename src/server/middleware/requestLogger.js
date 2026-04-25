const morgan = require("morgan");
const logger = require("../config/logger");

const stream = {
  write: (message) => logger.http ? logger.http(message.trim()) : logger.info(message.trim()),
};

const requestLogger = morgan("combined", { stream });

module.exports = requestLogger;
