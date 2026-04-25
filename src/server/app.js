const path = require("path");
const fs = require("fs");
const express = require("express");

const env = require("./config/env");
const requestLogger = require("./middleware/requestLogger");
const { securityMiddleware } = require("./middleware/security");
const { apiLimiter } = require("./middleware/rateLimit");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

app.use(securityMiddleware);
app.use(requestLogger);
app.use(apiLimiter);
app.use(express.text({ type: ["text/*", "application/csv"], limit: "2mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

app.use("/uploads", express.static(env.UPLOAD_DIR));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", resourceRoutes);

// Fallback for missing routes
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, error: { message: "API route not found" } });
});

module.exports = app;
