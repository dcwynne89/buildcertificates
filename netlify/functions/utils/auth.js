/* ============================================================
   auth.js — API key authentication middleware
   BuildCertificates — validates bcrt_ keys, checks quota
   ============================================================ */

const { validateKey, checkQuota } = require("./storage");

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
    },
    body: JSON.stringify(body),
  };
}

function errorResponse(statusCode, message, extra = {}) {
  return jsonResponse(statusCode, { success: false, error: message, ...extra });
}

/**
 * Authenticate a request via X-API-Key header.
 * Returns { auth, response } — if response is set, return it immediately.
 */
async function authenticate(event, options = {}) {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { auth: null, response: jsonResponse(204, "") };
  }

  const apiKey = event.headers["x-api-key"] || event.headers["X-API-Key"];

  if (!apiKey) {
    return {
      auth: null,
      response: errorResponse(401, "Missing API key. Include 'X-API-Key' header.", {
        hint: "Register at POST /api/v1/register or visit https://buildcertificates.com/api/docs",
      }),
    };
  }

  const keyData = await validateKey(apiKey);
  if (!keyData) {
    return {
      auth: null,
      response: errorResponse(401, "Invalid API key.", {
        hint: "Register a new key at POST /api/v1/register",
      }),
    };
  }

  // Check quota if needed
  if (options.countUsage) {
    const quota = await checkQuota(keyData.hash, keyData.tier);
    if (!quota.allowed) {
      return {
        auth: null,
        response: errorResponse(429, `Monthly quota exceeded (${quota.used}/${quota.limit}).`, {
          currentTier: keyData.tier.name,
          used: quota.used,
          limit: quota.limit,
          upgrade: "https://buildcertificates.com/api/docs#pricing",
        }),
      };
    }
    keyData.quota = quota;
  }

  return { auth: keyData, response: null };
}

module.exports = { authenticate, jsonResponse, errorResponse };
