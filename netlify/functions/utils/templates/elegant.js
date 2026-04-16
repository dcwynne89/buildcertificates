/* ============================================================
   elegant.js — Elegant certificate template for pdfmake
   Gold/navy design. Target: cream background, thick navy outer
   border + inner gold border, large serif-style name, proper
   signature + institutional seal + QR bottom row.
   ============================================================ */

const mm = (v) => v * 2.8346;

module.exports = function elegantTemplate(data, options = {}) {
  const navy  = options.color  || "#1B365D";
  const gold  = options.accent || "#C5A55A";
  const pageSize = (options.pageSize || "letter").toUpperCase();

  const { recipient = {}, certificate = {}, verifyId, qrDataUrl } = data;

  const recipientName = recipient.name        || "Recipient Name";
  const certTitle     = certificate.title     || "Certificate of Completion";
  const courseName    = certificate.course    || "";
  const rawDate       = certificate.date
    ? new Date(certificate.date + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const issuerName    = certificate.issuer    || "";
  const issuerTitle   = certificate.issuer_title || "";

  // ── Page dimensions for letter landscape ──
  // Letter = 792 x 612 pts. Margins = 25pt each side.
  const W = 792;
  const H = 612;
  const pad = 28;

  // ── Layered border: thick navy outer + thin gold inner ──
  const borders = {
    absolutePosition: { x: 0, y: 0 },
    canvas: [
      // Cream background fill
      { type: "rect", x: 0,       y: 0,       w: W,         h: H,         color: "#FDFAF3" },
      // Thick navy outer border
      { type: "rect", x: pad,     y: pad,     w: W-pad*2,   h: H-pad*2,   lineWidth: 10, lineColor: navy },
      // Thin gold inner border
      { type: "rect", x: pad+14,  y: pad+14,  w: W-pad*2-28, h: H-pad*2-28, lineWidth: 1.5, lineColor: gold },
    ],
  };

  // ── Corner ornaments (diamond shapes at each corner) ──
  const cornerSize = 14;
  const cx = pad + 4;
  const cy = pad + 4;
  const corners = {
    absolutePosition: { x: 0, y: 0 },
    canvas: [
      // Top-left
      { type: "rect", x: cx,       y: cy,       w: cornerSize, h: cornerSize, color: gold, transform: "rotate(45)" },
      // Top-right
      { type: "rect", x: W-cx-cornerSize, y: cy,  w: cornerSize, h: cornerSize, color: gold },
      // Bottom-left
      { type: "rect", x: cx,       y: H-cy-cornerSize, w: cornerSize, h: cornerSize, color: gold },
      // Bottom-right
      { type: "rect", x: W-cx-cornerSize, y: H-cy-cornerSize, w: cornerSize, h: cornerSize, color: gold },
    ],
  };

  // ── Top ornament line pair ──
  const ornamentLines = {
    canvas: [
      { type: "line", x1: 100, y1: 0,   x2: 632, y2: 0,   lineWidth: 1.5, lineColor: gold },
      { type: "line", x1: 100, y1: 4,   x2: 632, y2: 4,   lineWidth: 0.5, lineColor: gold },
    ],
    margin: [0, 18, 0, 6],
  };

  // ── Title (split across 2 lines like target image) ──
  const titleLines = certTitle.split(" ");
  const titleMid   = Math.ceil(titleLines.length / 2);
  const titleLine1 = titleLines.slice(0, titleMid).join(" ");
  const titleLine2 = titleLines.slice(titleMid).join(" ");

  const titleSection = titleLine2 ? [
    { text: titleLine1.toUpperCase(), fontSize: 30, bold: true, color: navy, alignment: "center", characterSpacing: 3, margin: [0, 0, 0, 2] },
    { text: titleLine2.toUpperCase(), fontSize: 30, bold: true, color: navy, alignment: "center", characterSpacing: 3, margin: [0, 0, 0, 0] },
  ] : [
    { text: titleLine1.toUpperCase(), fontSize: 30, bold: true, color: navy, alignment: "center", characterSpacing: 3, margin: [0, 0, 0, 0] },
  ];

  // ── Gold divider ──
  const divider = {
    canvas: [
      { type: "line", x1: 200, y1: 0, x2: 532, y2: 0, lineWidth: 1, lineColor: gold },
    ],
    margin: [0, 10, 0, 10],
  };

  // ── Presented to ──
  const presentedTo = {
    text: "This is proudly presented to",
    fontSize: 12,
    italics: true,
    color: "#666666",
    alignment: "center",
    margin: [0, 0, 0, 4],
  };

  // ── Recipient name — large & prominent ──
  const recipientSection = {
    text: recipientName,
    fontSize: 46,
    bold: true,
    color: navy,
    alignment: "center",
    margin: [60, 0, 60, 6],
  };

  // ── Underline below name ──
  const nameUnderline = {
    canvas: [
      { type: "line", x1: 140, y1: 0, x2: 592, y2: 0, lineWidth: 1.5, lineColor: gold },
    ],
    margin: [0, 0, 0, 8],
  };

  // ── Course ──
  const courseSection = courseName ? {
    text: `For successfully completing ${courseName}`,
    fontSize: 12,
    bold: true,
    color: "#333333",
    alignment: "center",
    margin: [80, 0, 80, 4],
  } : { text: "", margin: [0, 0, 0, 4] };

  // ── Date ──
  const dateSection = {
    text: `Date: ${rawDate}`,
    fontSize: 10,
    color: "#666666",
    alignment: "center",
    margin: [0, 0, 0, 10],
  };

  // ── Issuer name centered ──
  const issuerSection = issuerName ? {
    text: issuerName.toUpperCase(),
    fontSize: 12,
    bold: true,
    color: navy,
    alignment: "center",
    characterSpacing: 2,
    margin: [0, 0, 0, 8],
  } : { text: "", margin: [0, 0, 0, 8] };

  // ── Bottom: Signature left | Seal center | QR right ──
  const bottomRow = {
    columns: [
      // Left: Authorized Signature block
      {
        width: 180,
        stack: [
          { text: "Authorized Signature:", fontSize: 8, color: "#888888", margin: [0, 0, 0, 2] },
          { canvas: [{ type: "line", x1: 0, y1: 0, x2: 140, y2: 0, lineWidth: 1, lineColor: "#aaaaaa" }] },
          issuerName  ? { text: issuerName,  fontSize: 9,  bold: true, color: "#222222", margin: [0, 4, 0, 0] } : null,
          issuerTitle ? { text: issuerTitle, fontSize: 8,  color: "#888888", margin: [0, 1, 0, 0] } : null,
        ].filter(Boolean),
      },
      // Center: Seal / emblem
      {
        width: "*",
        alignment: "center",
        stack: [
          {
            canvas: [
              { type: "ellipse", x: 30, y: 30, r1: 28, r2: 28, lineWidth: 2, lineColor: gold },
              { type: "ellipse", x: 30, y: 30, r1: 22, r2: 22, lineWidth: 1, lineColor: gold },
            ],
          },
          { text: "✦", fontSize: 14, color: gold, alignment: "center", margin: [0, -44, 0, 0] },
        ],
      },
      // Right: QR code
      qrDataUrl ? {
        width: 80,
        alignment: "right",
        stack: [
          { image: qrDataUrl, width: 64, height: 64 },
          { text: verifyId ? `ID: ${verifyId}` : "", fontSize: 5.5, color: "#aaaaaa", alignment: "center", margin: [0, 2, 0, 0] },
        ],
      } : { width: 80, text: "" },
    ],
    margin: [50, 0, 50, 0],
  };

  return {
    pageSize,
    pageOrientation: "landscape",
    pageMargins: [pad + 18, pad + 18, pad + 18, options.watermark ? pad + 12 + 14 : pad + 12],
    background: () => borders,
    content: [
      corners,
      ornamentLines,
      ...titleSection,
      divider,
      presentedTo,
      recipientSection,
      nameUnderline,
      courseSection,
      dateSection,
      issuerSection,
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
