/* ============================================================
   verify.js — Public certificate verification endpoint
   GET /api/v1/verify/:id
   No API key required — public lookup
   ============================================================ */

const { jsonResponse, errorResponse } = require("./utils/auth");
const { lookupVerification } = require("./utils/verify-store");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return jsonResponse(204, "");
  if (event.httpMethod !== "GET") return errorResponse(405, "Use GET.");

  // Extract verify ID from path: /api/v1/verify/{id}
  const pathParts = event.path.replace(/^\/+|\/+$/g, "").split("/");
  const verifyId = pathParts[pathParts.length - 1];

  if (!verifyId || verifyId === "verify") {
    return errorResponse(400, "Missing verification ID. Use /api/v1/verify/{id}");
  }

  const record = await lookupVerification(verifyId);

  if (!record) {
    return jsonResponse(404, {
      success: false,
      verified: false,
      message: "Certificate not found. This verification ID does not exist.",
    });
  }

  return jsonResponse(200, {
    success: true,
    verified: record.valid,
    certificate: {
      recipient: record.recipientName,
      title: record.certificateTitle,
      course: record.courseName,
      issuer: record.issuer,
      dateIssued: record.dateIssued,
      issuedAt: record.createdAt,
    },
  });
};
