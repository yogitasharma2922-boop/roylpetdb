const db = require("../db/knex");
const { sanitizePayload, insertWithId, buildListQuery, paginate } = require("../services/tableService");
const { loadOwnerContext } = require("../services/ownerContextService");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

const listResources = (table) => async (req, res) => {
  const cols = await require("../services/tableService").getTableColumns(table);
  let query = buildListQuery(table, cols, req.query);

  const ownerCtx = await loadOwnerContext(req);
  if (ownerCtx) {
    if (table === "pets") {
      query = query.where("ownerId", ownerCtx.ownerId);
    } else if (table === "owners") {
      query = query.where("id", ownerCtx.ownerId);
    } else if (["appointments", "visits", "prescriptions", "invoices", "vaccinations"].includes(table)) {
      query = query.whereIn("petId", ownerCtx.petIds);
    }
  }

  const result = await paginate(query, req.query.page, req.query.limit);
  return sendSuccess(res, result.data, result.meta);
};

const getResource = (table) => async (req, res) => {
  const { id } = req.params;
  const resource = await db(table).where({ id }).first();
  if (!resource) throw new ApiError(404, "Resource not found");

  const ownerCtx = await loadOwnerContext(req);
  if (ownerCtx) {
    // Check ownership
    let allowed = false;
    if (table === "pets" && resource.ownerId === ownerCtx.ownerId) allowed = true;
    if (table === "owners" && resource.id === ownerCtx.ownerId) allowed = true;
    if (["appointments", "visits", "prescriptions", "invoices", "vaccinations"].includes(table) && ownerCtx.petIds.includes(resource.petId)) allowed = true;
    if (!allowed) throw new ApiError(403, "Forbidden");
  }

  return sendSuccess(res, resource);
};

const createResource = (table) => async (req, res) => {
  const payload = await sanitizePayload(table, req.body);
  const id = await insertWithId(table, payload);
  const resource = await db(table).where({ id }).first();
  return sendSuccess(res, resource, undefined, 201);
};

const updateResource = (table) => async (req, res) => {
  const { id } = req.params;
  const payload = await sanitizePayload(table, req.body);
  await db(table).where({ id }).update(payload);
  const resource = await db(table).where({ id }).first();
  return sendSuccess(res, resource);
};

const deleteResource = (table) => async (req, res) => {
  const { id } = req.params;
  await db(table).where({ id }).delete();
  return sendSuccess(res, { id });
};

const replaceResources = (table, allowBulk) => async (req, res) => {
  if (!allowBulk) throw new ApiError(403, "Bulk sync disabled");
  const items = Array.isArray(req.body) ? req.body : (req.body.items || []);
  if (!items.length) return sendSuccess(res, []);

  await db.transaction(async (trx) => {
    for (const item of items) {
      if (item.id) {
        const payload = await sanitizePayload(table, item);
        await trx(table).where({ id: item.id }).update(payload);
      } else {
        const payload = await sanitizePayload(table, item);
        await insertWithId(table, payload, trx);
      }
    }
  });

  return sendSuccess(res, { count: items.length });
};

module.exports = {
  listResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  replaceResources,
};
