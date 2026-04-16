/* ============================================================
   bulk.js — Bulk certificate generation endpoint
   POST /api/v1/bulk

   Accepts array of recipients + shared certificate config.
   Starter tier and above only.
   ============================================================ */

const { authenticate, jsonResponse, errorResponse } = require("./utils/auth");
const { incrementUsage, MAX_BODY_BYTES } = require("./utils/storage");
const { generateVerifyId } = require("./utils/verify-store");

const TEMPLATES = {
  elegant: require("./utils/templates/elegant"),
  modern:  require("./utils/templates/modern"),
  formal:  require("./utils/templates/formal"),
};

exports.handler = async (event) => {
  const { auth, response } = await authenticate(event, { countUsage: true });
  if (response) return response;

  if (event.httpMethod !== "POST") return errorResponse(405, "Use POST.");

  // ── Tier check ──
  if (!auth.tier.bulkEnabled) {
    return errorResponse(403, "Bulk generation requires Starter plan or above.", {
      currentTier: auth.tier.name,
      upgrade: "https://buildcertificates.com/api/docs#pricing",
    });
  }

  if (event.body && Buffer.byteLength(event.body, "utf-8") > MAX_BODY_BYTES) {
    return errorResponse(413, "Request body too large.");
  }

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return errorResponse(400, "Invalid JSON."); }

  const { recipients, certificate = {}, options = {} } = body;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return errorResponse(400, "Missing 'recipients' array.", {
      example: { recipients: [{ name: "Jane Smith" }, { name: "John Doe" }] },
    });
  }

  if (recipients.length > auth.tier.bulkMax) {
    return errorResponse(400, `Too many recipients. Your plan allows ${auth.tier.bulkMax} per batch.`, {
      sent: recipients.length,
      limit: auth.tier.bulkMax,
    });
  }

  // Check remaining quota
  const needed = recipients.length;
  if (auth.quota.remaining < needed) {
    return errorResponse(429, `Not enough quota. Need ${needed}, have ${auth.quota.remaining}.`, {
      needed,
      remaining: auth.quota.remaining,
    });
  }

  // ── Template ──
  const templateName = options.template || "elegant";
  const templateFn = TEMPLATES[templateName];
  if (!templateFn) return errorResponse(400, `Unknown template: '${templateName}'.`);
  if (!auth.tier.templates.includes(templateName)) {
    return errorResponse(403, `Template '${templateName}' not available on your plan.`);
  }

  try {
    const QRCode = require("qrcode");
    const { getStore } = require("@netlify/blobs");
    const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
    const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN;
    let verifyStore;
    if (siteID && token) {
      verifyStore = getStore({ name: "cert-verify", siteID, token });
    } else {
      verifyStore = getStore("cert-verify");
    }

    const results = [];

    for (const recipient of recipients) {
      if (!recipient.name) {
        results.push({ error: "Missing recipient name", recipient });
        continue;
      }

      // Generate verification
      let verifyId = null;
      let qrDataUrl = null;

      if (options.verification !== false) {
        verifyId = generateVerifyId();
        const verifyUrl = `https://buildcertificates.com/verify.html?id=${verifyId}`;
        qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 200, margin: 1, color: { dark: "#333333", light: "#ffffff" } });

        await verifyStore.setJSON(verifyId, {
          recipientName: recipient.name,
          certificateTitle: certificate.title || "Certificate of Completion",
          courseName: certificate.course || "",
          issuer: certificate.issuer || "",
          dateIssued: certificate.date || new Date().toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
          valid: true,
        });
      }

      const certData = { recipient, certificate, verifyId, qrDataUrl };
      const templateOptions = { color: options.color, accent: options.accent, pageSize: options.pageSize || "letter", watermark: auth.tier.watermark };
      const docDefinition = templateFn(certData, templateOptions);
      const pdfBuffer = await renderPdf(docDefinition);

      results.push({
        recipient: recipient.name,
        pdf: pdfBuffer.toString("base64"),
        sizeBytes: pdfBuffer.length,
        verification: verifyId ? { id: verifyId, url: `https://buildcertificates.com/verify.html?id=${verifyId}` } : null,
      });
    }

    // Increment usage by number of successful certs
    const successCount = results.filter((r) => !r.error).length;
    await incrementUsage(auth.hash, successCount);

    return jsonResponse(200, {
      success: true,
      generated: successCount,
      total: recipients.length,
      template: templateName,
      certificates: results,
      usage: {
        used: auth.quota.used + successCount,
        limit: auth.quota.limit,
        remaining: auth.quota.remaining - successCount,
      },
    });

  } catch (err) {
    console.error("Bulk generation error:", err);
    return errorResponse(500, "Bulk generation failed.");
  }
};

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
