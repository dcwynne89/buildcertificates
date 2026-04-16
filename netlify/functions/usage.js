/* ============================================================
   usage.js — Quota usage endpoint
   GET /api/v1/usage
   ============================================================ */

const { authenticate, jsonResponse } = require("./utils/auth");
const { getUsage, currentMonth } = require("./utils/storage");

exports.handler = async (event) => {
  const { auth, response } = await authenticate(event);
  if (response) return response;

  const used = await getUsage(auth.hash);
  const limit = auth.tier.certsPerMonth;

  return jsonResponse(200, {
    success: true,
    tier: auth.tier.name,
    period: currentMonth(),
    used,
    limit,
    remaining: Math.max(0, limit - used),
    features: {
      watermark: auth.tier.watermark,
      bulkEnabled: auth.tier.bulkEnabled,
      bulkMax: auth.tier.bulkMax,
      templates: auth.tier.templates,
    },
  });
};
