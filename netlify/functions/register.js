/* ============================================================
   register.js — API key registration
   POST /api/v1/register
   ============================================================ */

const { registerKey, emailHasKey, checkRegistrationLimit, recordRegistrationAttempt } = require("./utils/storage");
const { jsonResponse, errorResponse } = require("./utils/auth");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return jsonResponse(204, "");
  if (event.httpMethod !== "POST") return errorResponse(405, "Use POST.");

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return errorResponse(400, "Invalid JSON."); }

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return errorResponse(400, "Valid email required.", {
      example: { email: "you@example.com" },
    });
  }

  // Rate limit registrations
  const ip = (event.headers["x-forwarded-for"] || event.headers["client-ip"] || "unknown").split(",")[0].trim();
  const limit = await checkRegistrationLimit(ip);
  if (!limit.allowed) {
    return errorResponse(429, "Too many registrations. Try again in an hour.");
  }

  // Check if email already registered
  const exists = await emailHasKey(email);
  if (exists) {
    return errorResponse(409, "This email already has an API key. Contact support if you lost it.");
  }

  await recordRegistrationAttempt(ip);
  const { apiKey } = await registerKey(email);

  return jsonResponse(201, {
    success: true,
    api_key: apiKey,
    tier: "Free",
    limits: { certsPerMonth: 25, ratePerMinute: 5 },
    message: "Save your API key — it cannot be retrieved later.",
    docs: "https://buildcertificates.com/api/docs",
  });
};
