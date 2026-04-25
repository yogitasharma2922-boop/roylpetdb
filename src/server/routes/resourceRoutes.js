const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");
const env = require("../config/env");
const {
  listResources,
  getResource,
  createResource,
  replaceResources,
  updateResource,
  deleteResource,
} = require("../controllers/resourceController");

const router = express.Router();

const registerResource = (name, allowRoles = ["admin", "doctor", "receptionist"], allowCreate = true, readRoles) => {
  const viewRoles = readRoles || ["admin", "doctor", "receptionist", "owner"];
  const bulkRoles = name === "appointments" ? allowRoles.filter((role) => role !== "owner") : allowRoles;
  const allowBulk = env.ALLOW_BULK_SYNC;

  router.get(`/${name}`, authenticate, requireRole(viewRoles), listResources(name));
  router.get(`/${name}/:id`, authenticate, requireRole(viewRoles), getResource(name));

  if (allowCreate) {
    router.post(`/${name}`, authenticate, requireRole(allowRoles), createResource(name));
  }

  router.put(`/${name}`, authenticate, requireRole(bulkRoles), (req, res, next) => replaceResources(name, allowBulk)(req, res, next));
  router.put(`/${name}/:id`, authenticate, requireRole(allowRoles), updateResource(name));
  router.delete(`/${name}/:id`, authenticate, requireRole(allowRoles), deleteResource(name));
};

registerResource("owners", ["admin", "receptionist"]);
registerResource("pets", ["admin", "doctor", "receptionist"]);
registerResource("visits", ["admin", "doctor", "receptionist"]);
registerResource("appointments", ["admin", "doctor", "receptionist", "owner"]);
registerResource("inventory", ["admin", "doctor", "receptionist"], true, ["admin", "doctor", "receptionist"]);
registerResource("prescriptions", ["admin", "doctor"]);
registerResource("invoices", ["admin", "doctor", "receptionist"]);
registerResource("vaccinations", ["admin", "doctor", "receptionist"]);
registerResource("activity_log", ["admin"], false, ["admin"]);
registerResource("clinic_settings", ["admin"], false, ["admin"]);

module.exports = router;
