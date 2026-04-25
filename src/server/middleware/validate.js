const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, _res, next) => {
  try {
    req.validated = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    return next();
  } catch (err) {
    return next(new ApiError(400, "Validation error", err.errors || err.message));
  }
};

module.exports = validate;
