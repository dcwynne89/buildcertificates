/* ============================================================
   elegant.js — Elegant certificate template for pdfmake
   Premium: filled navy header band, gold filled corner diamonds,
   cream background, dramatic typography hierarchy.
   ============================================================ */

const mm = (v) => v * 2.8346;

module.exports = function elegantTemplate(data, options = {}) {
  const navy  = options.color  || "#1B365D";
  const gold  = options.accent || "#C5A55A";
  const pageSize = (options.pageSize || "letter").toUpperCase();

  const { recipient = {}, certificate = {}, verifyId, qrDataUrl } = data;
  const recipientName = recipient.name            || "Recipient Name";
  const certTitle     = certificate.title         || "Certificate of Completion";
  const courseName    = certificate.course        || "";
  const rawDate       = certificate.date
    ? new Date(certificate.date + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const issuerName    = certificate.issuer        || "";
  const issuerTitle   = certificate.issuer_title  || "";

  const W = 792;
  const H = 612;
  const pad = 24;
  const headerH = 90; // filled navy header height

  // ── Background layers ──
  const bgLayer = () => ({
    absolutePosition: { x: 0, y: 0 },
    canvas: [
      // Cream base
      { type: "rect", x: 0, y: 0, w: W, h: H, color: "#FDFAF3" },
      // Filled navy header band
      { type: "rect", x: 0, y: 0, w: W, h: headerH, color: navy },
      // Gold rule below header
      { type: "rect", x: 0, y: headerH, w: W, h: 3, color: gold },
      // Gold rule at bottom
      { type: "rect", x: 0, y: H - 3, w: W, h: 3, color: gold },
      // Thin navy rule at very bottom
      { type: "rect", x: 0, y: H - 8, w: W, h: 5, color: navy },

      // Outer border on sides only (between header and bottom rule)
      { type: "rect", x: pad, y: headerH + 10, w: W - pad*2, h: H - headerH - 10 - 14, lineWidth: 1.5, lineColor: gold },

      // ── Filled gold corner diamonds on body ──
      // Top-left of inner frame
      { type: "rect", x: pad - 5,       y: headerH + 5,  w: 10, h: 10, color: gold },
      // Top-right
      { type: "rect", x: W - pad - 5,   y: headerH + 5,  w: 10, h: 10, color: gold },
      // Bottom-left
      { type: "rect", x: pad - 5,       y: H - 24,       w: 10, h: 10, color: gold },
      // Bottom-right
      { type: "rect", x: W - pad - 5,   y: H - 24,       w: 10, h: 10, color: gold },

      // ── Decorative gold vertical bars flanking header text ──
      { type: "rect", x: 30, y: 12, w: 3, h: headerH - 24, color: gold },
      { type: "rect", x: W - 33, y: 12, w: 3, h: headerH - 24, color: gold },
    ],
  });

  // ── Title — white reversed in navy header ──
  const titleSection = {
    text: certTitle.toUpperCase(),
    fontSize: 28,
    bold: true,
    color: "#FFFFFF",
    alignment: "center",
    characterSpacing: 5,
    margin: [60, 18, 60, 4],
  };

  // ── Gold ornament tag line under title ──
  const subTagline = {
    text: "✦  ─────────────────────────────────────  ✦",
    fontSize: 9,
    color: gold,
    alignment: "center",
    margin: [0, 0, 0, 0],
  };

  // ── "This is proudly presented to" ──
  const presentedTo = {
    text: "This is proudly presented to",
    fontSize: 11,
    italics: true,
    color: "#666666",
    alignment: "center",
    margin: [0, 16, 0, 4],
  };

  // ── Recipient name — large & dramatic ──
  const recipientSection = {
    text: recipientName,
    fontSize: 50,
    bold: true,
    color: navy,
    alignment: "center",
    margin: [60, 0, 60, 4],
  };

  // ── Gold underline rule below name ──
  const nameRule = {
    canvas: [
      { type: "rect", x: 180, y: 0, w: 392, h: 2, color: gold },
    ],
    margin: [0, 0, 0, 8],
  };

  // ── Course line ──
  const courseSection = courseName ? {
    text: `For successfully completing  ${courseName}`,
    fontSize: 12,
    bold: true,
    color: "#333333",
    alignment: "center",
    margin: [80, 0, 80, 4],
  } : { text: "", margin: [0, 0, 0, 4] };

  // ── Date ──
  const dateSection = {
    text: rawDate,
    fontSize: 10,
    color: "#888888",
    alignment: "center",
    margin: [0, 0, 0, 12],
  };

  // ── Bottom row: Signature | Issuer name | QR ──
  const bottomRow = {
    columns: [
      // Left: Signature block
      {
        width: 200,
        margin: [50, 0, 0, 0],
        stack: [
          { text: "Authorized Signature", fontSize: 7.5, color: "#999999", margin: [0, 0, 0, 3] },
          { canvas: [{ type: "rect", x: 0, y: 0, w: 150, h: 1, color: "#cccccc" }] },
          issuerName  ? { text: issuerName,  fontSize: 9.5, bold: true, color: "#222222", margin: [0, 4, 0, 0] } : null,
          issuerTitle ? { text: issuerTitle, fontSize: 8,   color: "#888888", margin: [0, 1, 0, 0] } : null,
        ].filter(Boolean),
      },
      // Center: spacer
      { width: "*", text: "" },
      // Right: QR
      qrDataUrl ? {
        width: 90,
        margin: [0, 0, 50, 0],
        stack: [
          { image: qrDataUrl, width: 62, height: 62, alignment: "right" },
          { text: verifyId ? `ID: ${verifyId}` : "", fontSize: 5.5, color: "#aaaaaa", alignment: "right", margin: [0, 2, 0, 0] },
        ],
      } : { width: 90, text: "" },
    ],
  };

  return {
    pageSize,
    pageOrientation: "landscape",
    pageMargins: [pad, 0, pad, 14],
    background: bgLayer,
    content: [
      titleSection,
      subTagline,
      presentedTo,
      recipientSection,
      nameRule,
      courseSection,
      dateSection,
      bottomRow,
    ],
    defaultStyle: {
      font: "Roboto",
      fontSize: 11,
      lineHeight: 1.3,
      color: "#1a1a1a",
    },
    footer: options.watermark
      ? () => ({
          text: "Generated by BuildCertificates — buildcertificates.com",
          alignment: "center", fontSize: 7, color: "#cccccc", margin: [mm(15), 4, mm(15), 0],
        })
      : undefined,
  };
};
