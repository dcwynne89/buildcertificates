/* ============================================================
   generate.js — Certificate generation endpoint
   POST /api/v1/generate

   Input:  Structured JSON (recipient, certificate, options)
   Output: Base64-encoded PDF certificate + verification ID
   ============================================================ */

const { authenticate, jsonResponse, errorResponse } = require("./utils/auth");
const { incrementUsage, MAX_BODY_BYTES } = require("./utils/storage");

// Load templates
const TEMPLATES = {
  elegant: require("./utils/templates/elegant"),
  modern:  require("./utils/templates/modern"),
  formal:  require("./utils/templates/formal"),
};

exports.handler = async (event) => {
  // ── Auth ──
  const { auth, response } = await authenticate(event, { countUsage: true });
  if (response) return response;

  if (event.httpMethod !== "POST") {
    return errorResponse(405, "Method not allowed. Use POST.");
  }

  // ── Body size check ──
  if (event.body && Buffer.byteLength(event.body, "utf-8") > MAX_BODY_BYTES) {
    return errorResponse(413, "Request body too large. Maximum 10MB.");
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return errorResponse(400, "Invalid JSON body.");
  }

  // ── Validate required fields ──
  const { recipient, certificate = {}, options = {} } = body;

  if (!recipient || !recipient.name) {
    return errorResponse(400, "Missing required field: 'recipient.name'.", {
      example: { recipient: { name: "Jane Smith" } },
    });
  }

  // ── Template gating ──
  const templateName = options.template || "elegant";
  if (!TEMPLATES[templateName]) {
    return errorResponse(400, `Unknown template: '${templateName}'. Available: ${Object.keys(TEMPLATES).join(", ")}`, {
      available: Object.keys(TEMPLATES),
    });
  }

  // Check template access by tier
  if (!auth.tier.templates.includes(templateName)) {
    return errorResponse(403, `Template '${templateName}' requires Starter plan or above.`, {
      currentTier: auth.tier.name,
      availableTemplates: auth.tier.templates,
      upgrade: "https://buildcertificates.com/api/docs#pricing",
    });
  }

  try {
    // ── Generate QR verification ──
    let verifyId = null;
    let qrDataUrl = null;

    if (options.verification !== false) {
      const { generateVerifyId } = require("./utils/verify-store");
      const { getStore } = require("@netlify/blobs");
      verifyId = generateVerifyId();

      // Generate QR code as data URL
      const QRCode = require("qrcode");
      const verifyUrl = `https://buildcertificates.com/verify.html?id=${verifyId}`;
      qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 200,
        margin: 1,
        color: { dark: "#333333", light: "#ffffff" },
      });

      // Store verification record (single write)
      const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
      const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN;
      const store = (siteID && token)
        ? getStore({ name: "cert-verify", siteID, token })
        : getStore("cert-verify");
      await store.setJSON(verifyId, {
        recipientName: recipient.name,
        certificateTitle: certificate.title || "Certificate of Completion",
        courseName: certificate.course || "",
        issuer: certificate.issuer || "",
        dateIssued: certificate.date || new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        valid: true,
      });
    }

    // ── Build template data ──
    const certData = { recipient, certificate, verifyId, qrDataUrl };
    const templateOptions = {
      color: options.color,
      accent: options.accent,
      pageSize: options.pageSize || "letter",
      watermark: auth.tier.watermark,
    };

    const templateFn = TEMPLATES[templateName];
    const docDefinition = templateFn(certData, templateOptions);

    // ── Render PDF ──
    const pdfBuffer = await renderPdf(docDefinition);

    // ── Increment usage ──
    await incrementUsage(auth.hash);

    return jsonResponse(200, {
      success: true,
      pdf: pdfBuffer.toString("base64"),
      pages: 1,
      sizeBytes: pdfBuffer.length,
      verification: verifyId ? {
        id: verifyId,
        url: `https://buildcertificates.com/verify.html?id=${verifyId}`,
      } : null,
      template: templateName,
      watermark: auth.tier.watermark,
      usage: {
        used: auth.quota.used + 1,
        limit: auth.quota.limit,
        remaining: auth.quota.remaining - 1,
      },
      powered_by: "https://buildcertificates.com",
    });

  } catch (err) {
    console.error("Certificate generation error:", err);
    return errorResponse(500, "Certificate generation failed. Please try again.");
  }
};

// ─────────────────────────────────────────────────────────────
// Render pdfmake document definition → PDF buffer
// ─────────────────────────────────────────────────────────────
async function renderPdf(docDefinition) {
  const PdfPrinter = require("pdfmake/src/printer");
  const vfsData = require("pdfmake/build/vfs_fonts");
  const fonts = {
    Roboto: {
      normal:      Buffer.from(vfsData["Roboto-Regular.ttf"],       "base64"),
      bold:        Buffer.from(vfsData["Roboto-Medium.ttf"],        "base64"),
      italics:     Buffer.from(vfsData["Roboto-Italic.ttf"],        "base64"),
      bolditalics: Buffer.from(vfsData["Roboto-MediumItalic.ttf"], "base64"),
    },
  };

  const printer = new PdfPrinter(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  return new Promise((resolve, reject) => {
    const chunks = [];
    pdfDoc.on("data", (c) => chunks.push(c));
    pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
    pdfDoc.on("error", reject);
    pdfDoc.end();
  });
}
