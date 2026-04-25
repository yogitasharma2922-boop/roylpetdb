const sendSuccess = (res, data, meta, status = 200) =>
  res.status(status).json({ success: true, data, meta });

const sendError = (res, status, message, details) =>
  res.status(status).json({ success: false, error: { message, details } });

module.exports = { sendSuccess, sendError };
