const path = require("path");
const dotenv = require("dotenv");

const NODE_ENV = process.env.NODE_ENV || "development";
const isProd = NODE_ENV === "production";

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, "..", "..", "..", ".env") });

const theEnv = {
  NODE_ENV,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || "royal-pet-secret-key-123",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  CORS_ORIGINS: process.env.CORS_ORIGINS || "",
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX || 300),
  LOG_LEVEL: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, "..", "..", "uploads"),
  ALLOW_BULK_SYNC: process.env.ALLOW_BULK_SYNC === "true",
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || "local",
  STORAGE_PUBLIC_BASE_URL: process.env.STORAGE_PUBLIC_BASE_URL || "",
  S3_BUCKET: process.env.S3_BUCKET || "",
  S3_REGION: process.env.S3_REGION || "auto",
  S3_ENDPOINT: process.env.S3_ENDPOINT || "",
  S3_PUBLIC_BASE_URL: process.env.S3_PUBLIC_BASE_URL || "",
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || "",
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || "",
};

module.exports = { ...theEnv, isProd };
