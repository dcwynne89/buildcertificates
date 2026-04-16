/* ============================================================
   formal.js — Formal/academic certificate template for pdfmake
   Premium: deep parchment background, filled burgundy corner
   ornament blocks, multi-ring seal, ornate flourish lines,
   course name bold & prominent.
   ============================================================ */

const mm = (v) => v * 2.8346;

module.exports = function formalTemplate(data, options = {}) {
  const color    = options.color || "#6B1D2A";   // Burgundy
  const gold     = "#B8962E";                    // Antique gold accent
  const pageSize = (options.pageSize || "letter").toUpperCase();

  const { recipient = {}, certificate = {}, verifyId, qrDataUrl } = data;
  const recipientName = recipient.name            || "Recipient Name";
  const certTitle     = certificate.title         || "Certificate of Achievement";
  const courseName    = certificate.course        || "";
  const rawDate       = certificate.date
    ? new Date(certificate.date + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const issuerName    = certificate.issuer        || "";
  const issuerTitle   = certificate.issuer_title  || "";

  const W = 792;
  const H = 612;
  const pad = 20;
  const co  = 18; // corner ornament size

  // ── Background layers ──
  const bgLayer = () => ({
    absolutePosition: { x: 0, y: 0 },
    canvas: [
      // Deep parchment fill
      { type: "rect", x: 0, y: 0, w: W, h: H, color: "#F5EDD8" },

      // Subtle inner cream panel
      { type: "rect", x: pad + 4, y: pad + 4, w: W - pad*2 - 8, h: H - pad*2 - 8, color: "#FDFAF3" },

      // Outer border — thick burgundy
      { type: "rect", x: pad, y: pad, w: W - pad*2, h: H - pad*2, lineWidth: 4, lineColor: color },
      // Inner border — thin gold
      { type: "rect", x: pad + 8, y: pad + 8, w: W - pad*2 - 16, h: H - pad*2 - 16, lineWidth: 1, lineColor: gold },

      // ── Filled corner block ornaments ──
      // Top-left
      { type: "rect", x: pad,              y: pad,              w: co, h: co, color: color },
      { type: "rect", x: pad + 2,          y: pad + 2,          w: co - 4, h: co - 4, color: "#FDFAF3" },
      // Top-right
      { type: "rect", x: W - pad - co,     y: pad,              w: co, h: co, color: color },
      { type: "rect", x: W - pad - co + 2, y: pad + 2,          w: co - 4, h: co - 4, color: "#FDFAF3" },
      // Bottom-left
      { type: "rect", x: pad,              y: H - pad - co,     w: co, h: co, color: color },
      { type: "rect", x: pad + 2,          y: H - pad - co + 2, w: co - 4, h: co - 4, color: "#FDFAF3" },
      // Bottom-right
      { type: "rect", x: W - pad - co,     y: H - pad - co,     w: co, h: co, color: color },
      { type: "rect", x: W - pad - co + 2, y: H - pad - co + 2, w: co - 4, h: co - 4, color: "#FDFAF3" },

      // ── Mid-border diamond tick marks (decorative) ──
      { type: "rect", x: W/2 - 5, y: pad - 2,   w: 10, h: 10, color: gold },
      { type: "rect", x: W/2 - 5, y: H - pad - 8, w: 10, h: 10, color: gold },
      { type: "rect", x: pad - 2,     y: H/2 - 5, w: 10, h: 10, color: gold },
      { type: "rect", x: W - pad - 8, y: H/2 - 5, w: 10, h: 10, color: gold },
    ],
  });

  // ── Title ──
  const titleSection = {
    text: certTitle,
    fontSize: 26,
    bold: true,
    color: color,
    alignment: "center",
    margin: [0, 22, 0, 4],
  };

  // ── Ornate flourish — lines + diamond ──
  const flourish = {
    canvas: [
      { type: "line", x1: 100, y1: 4, x2: 330, y2: 4, lineWidth: 1, lineColor: color },
      { type: "rect", x: 335, y: 0, w: 8, h: 8, color: gold },
      { type: "line", x1: 346, y1: 4, x2: 576, y2: 4, lineWidth: 1, lineColor: color },
    ],
    margin: [0, 2, 0, 8],
  };

  // ── "Presented to" ──
  const presentedTo = {
    text: "Presented to",
    fontSize: 11,
    italics: true,
    color: "#666666",
    alignment: "center",
    margin: [0, 0, 0, 4],
  };

  // ── Recipient — large italic ──
  const recipientSection = {
    text: recipientName,
    fontSize: 42,
    bold: true,
    italics: true,
    color: "#111111",
    alignment: "center",
    margin: [60, 0, 60, 4],
  };

  // ── Name underline ──
  const nameRule = {
    canvas: [
      { type: "line", x1: 190, y1: 0, x2: 560, y2: 0, lineWidth: 1, lineColor: "#cccccc" },
    ],
    margin: [0, 0, 0, 8],
  };

  // ── Course ──
  const courseSection = courseName ? [
    {
      text: "In recognition of completing",
      fontSize: 10,
      italics: true,
      color: "#555555",
      alignment: "center",
      margin: [80, 0, 80, 3],
    },
    {
      text: courseName.toUpperCase(),
      fontSize: 15,
      bold: true,
      color: color,
      alignment: "center",
      characterSpacing: 2,
      margin: [40, 0, 40, 8],
    },
  ] : [{ text: "", margin: [0, 0, 0, 8] }];

  // ── Date ──
  const dateSection = {
    text: rawDate,
    fontSize: 10,
    color: "#888888",
    alignment: "center",
    margin: [0, 0, 0, 8],
  };

  // ── Bottom: Seal | Issuer | QR ──
  const bottomRow = {
    columns: [
      // Left: multi-ring seal
      {
        width: 90,
        alignment: "center",
        stack: [
          {
            canvas: [
              { type: "ellipse", x: 34, y: 34, r1: 32, r2: 32, lineWidth: 3,   lineColor: color },
              { type: "ellipse", x: 34, y: 34, r1: 26, r2: 26, lineWidth: 1,   lineColor: color },
              { type: "ellipse", x: 34, y: 34, r1: 20, r2: 20, lineWidth: 0.5, lineColor: gold  },
            ],
          },
          { text: "OFFICIAL", fontSize: 6,  bold: true, color: color, alignment: "center", margin: [0, -46, 0, 0] },
          { text: "✦",        fontSize: 10, color: gold, alignment: "center",  margin: [0, 1, 0, 0] },
          { text: "SEAL",     fontSize: 6,  color: color, alignment: "center", margin: [0, 1, 0, 22] },
        ],
      },
      // Center: issuer
      {
        width: "*",
        alignment: "center",
        margin: [0, 18, 0, 0],
        stack: [
          { canvas: [{ type: "line", x1: 40, y1: 0, x2: 280, y2: 0, lineWidth: 1, lineColor: "#bbbbbb" }] },
          issuerName  ? { text: issuerName,  fontSize: 11, bold: true, color: "#222222", alignment: "center", margin: [0, 5, 0, 0] } : null,
          issuerTitle ? { text: issuerTitle, fontSize: 8,  color: "#888888", alignment: "center", margin: [0, 2, 0, 0] } : null,
        ].filter(Boolean),
      },
      // Right: QR
      qrDataUrl ? {
        width: 80,
        alignment: "right",
        stack: [
          { image: qrDataUrl, width: 56, height: 56, margin: [0, 8, 0, 0] },
          { text: verifyId || "", fontSize: 5.5, color: "#aaaaaa", alignment: "center", margin: [0, 2, 0, 0] },
        ],
      } : { width: 80, text: "" },
    ],
    margin: [40, 0, 40, 0],
  };

  return {
    pageSize,
    pageOrientation: "landscape",
    pageMargins: [pad + 14, pad + 12, pad + 14, options.watermark ? pad + 10 + 14 : pad + 10],
    background: bgLayer,
    content: [
      titleSection,
      flourish,
      presentedTo,
      recipientSection,
      nameRule,
      ...courseSection,
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
          alignment: "center", fontSize: 7, color: "#bbbbbb", margin: [mm(15), 4, mm(15), 0],
        })
      : undefined,
  };
};
