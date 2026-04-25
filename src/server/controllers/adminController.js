const db = require("../db/knex");
const { loadOwnerContext } = require("../services/ownerContextService");
const { sendSuccess } = require("../utils/apiResponse");

const buildScopedDump = async (user) => {
  const baseUserColumns = ["id", "name", "email", "role", "mobile", "active", "avatar", "lastLogin", "ownerId"];

  if (user.role === "owner") {
    const ctx = await loadOwnerContext({ user });
    const petIds = ctx?.petIds || [];
    const ownerId = ctx?.ownerId;
    const visitIdsQuery = db("visits").select("id").whereIn("petId", petIds.length ? petIds : [0]);

    const [users, owners, pets, visits, prescriptions, appointments, vaccinations, invoices, settings] = await Promise.all([
      db("users").select(baseUserColumns).where({ id: user.id }),
      ownerId ? db("owners").select().where({ id: ownerId }) : [],
      petIds.length ? db("pets").select().whereIn("id", petIds) : [],
      petIds.length ? db("visits").select().whereIn("petId", petIds) : [],
      petIds.length ? db("prescriptions").select().whereIn("visitId", visitIdsQuery) : [],
      ownerId ? db("appointments").select().where({ ownerId }) : [],
      petIds.length ? db("vaccinations").select().whereIn("petId", petIds) : [],
      petIds.length ? db("invoices").select().whereIn("petId", petIds) : [],
      db("clinic_settings").select().first(),
    ]);

    return {
      users,
      owners,
      pets,
      visits,
      prescriptions,
      appointments,
      vaccinations,
      inventory: [],
      invoices,
      activityLog: [],
      clinicSettings: settings,
    };
  }

  const [users, owners, pets, visits, prescriptions, appointments, vaccinations, inventory, invoices, activityLog, settings] = await Promise.all([
    db("users").select(baseUserColumns),
    db("owners").select(),
    db("pets").select(),
    db("visits").select(),
    db("prescriptions").select(),
    db("appointments").select(),
    db("vaccinations").select(),
    db("inventory").select(),
    db("invoices").select(),
    user.role === "admin" ? db("activity_log").select() : [],
    db("clinic_settings").select().first(),
  ]);

  return { users, owners, pets, visits, prescriptions, appointments, vaccinations, inventory, invoices, activityLog, clinicSettings: settings };
};

const getBootstrap = async (req, res) => {
  const data = await buildScopedDump(req.user);
  return sendSuccess(res, data);
};

const getDbDump = async (req, res) => {
  const data = await buildScopedDump(req.user);
  return sendSuccess(res, data);
};

module.exports = { getBootstrap, getDbDump };
