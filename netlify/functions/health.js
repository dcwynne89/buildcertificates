/* ============================================================
   health.js — Service health check
   GET /api/v1/health
   ============================================================ */

const { jsonResponse } = require("./utils/auth");

exports.handler = async () => {
  return jsonResponse(200, {
    status: "healthy",
    service: "BuildCertificates API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    docs: "https://buildcertificates.com/api/docs",
  });
};
