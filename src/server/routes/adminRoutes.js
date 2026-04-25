const express = require("express");

const { authenticate, requireRole } = require("../middleware/auth");
const { getBootstrap, getDbDump } = require("../controllers/adminController");

const router = express.Router();

router.get("/bootstrap", authenticate, getBootstrap);
router.get("/db", authenticate, requireRole(["admin"]), getDbDump);

module.exports = router;
