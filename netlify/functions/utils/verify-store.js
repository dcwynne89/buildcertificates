/* ============================================================
   verify-store.js — Storage for certificate verification records
   Maps verify_id → certificate metadata for QR code lookups
   ============================================================ */

const { getStore } = require("@netlify/blobs");

const VERIFY_STORE = "cert-verify";

function getConfiguredStore() {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN;
  if (siteID && token) return getStore({ name: VERIFY_STORE, siteID, token });
  return getStore(VERIFY_STORE);
}

function generateVerifyId() {
  const crypto = require("crypto");
  // Short, URL-safe ID: 12 chars
  return crypto.randomBytes(9).toString("base64url");
}

/**
 * Store a verification record for a generated certificate.
 */
async function storeVerification(data) {
  const store = getConfiguredStore();
  const verifyId = generateVerifyId();
  const record = {
    recipientName: data.recipientName,
    certificateTitle: data.certificateTitle,
    courseName: data.courseName,
    issuer: data.issuer,
    dateIssued: data.dateIssued,
    createdAt: new Date().toISOString(),
    valid: true,
  };
  await store.setJSON(verifyId, record);
  return verifyId;
}

/**
 * Look up a verification record by ID.
 */
async function lookupVerification(verifyId) {
  const store = getConfiguredStore();
  try {
    const record = await store.get(verifyId, { type: "json" });
    return record || null;
  } catch {
    return null;
  }
}

module.exports = { storeVerification, lookupVerification, generateVerifyId };
