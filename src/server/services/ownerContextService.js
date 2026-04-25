const db = require("../db/knex");

let HAS_OWNER_ID;
const hasOwnerIdColumn = async () => {
  if (HAS_OWNER_ID !== undefined) return HAS_OWNER_ID;
  try {
    HAS_OWNER_ID = await db.schema.hasColumn("users", "ownerId");
  } catch {
    HAS_OWNER_ID = false;
  }
  return HAS_OWNER_ID;
};

const loadOwnerContext = async (req) => {
  if (!req.user || req.user.role !== "owner") return null;
  if (req.ownerContext) return req.ownerContext;
  const user = await db("users").where({ id: req.user.id }).first();
  if (!user || !user.ownerId) {
    req.ownerContext = { ownerId: null, petIds: [] };
    return req.ownerContext;
  }
  const pets = await db("pets").where({ ownerId: user.ownerId }).select("id");
  req.ownerContext = { ownerId: user.ownerId, petIds: pets.map((p) => p.id) };
  return req.ownerContext;
};

module.exports = { hasOwnerIdColumn, loadOwnerContext };
