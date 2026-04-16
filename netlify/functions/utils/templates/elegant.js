/* ============================================================
   elegant.js — Elegant certificate template for pdfmake
   Gold/navy design, ornamental borders, centered calligraphy.
   Landscape orientation. QR verification code embedded.
   ============================================================ */

const mm = (v) => v * 2.8346;

/**
 * Build a pdfmake document definition for an elegant certificate.
 *
 * @param {object} data — { recipient, certificate, verifyId, qrDataUrl }
 * @param {object} options — { color, pageSize, watermark }
 * @returns {object} pdfmake docDefinition
 */
module.exports = function elegantTemplate(data, options = {}) {
  const color = options.color || "#1B365D";         // Navy blue
  const accent = options.accent || "#C5A55A";       // Gold
  const pageSize = (options.pageSize || "letter").toUpperCase();

  const { recipient = {}, certificate = {}, verifyId, qrDataUrl } = data;

  const recipientName = recipient.name || "Recipient Name";
  const certTitle = certificate.title || "Certificate of Completion";
  const courseName = certificate.course || "";
  const dateIssued = certificate.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const issuerName = certificate.issuer || "";
  const issuerTitle = certificate.issuer_title || "";

  // ── Decorative border (double-line frame) ──
  const borderCanvas = {
    absolutePosition: { x: 30, y: 30 },
    canvas: [
      // Outer border
      { type: "rect", x: 0, y: 0, w: 732, h: 552, r: 3, lineWidth: 2, lineColor: accent },
      // Inner border
      { type: "rect", x: 10, y: 10, w: 712, h: 532, r: 2, lineWidth: 1, lineColor: accent },
    ],
  };

  // ── Top ornamental line ──
  const topOrnament = {
    canvas: [
      { type: "line", x1: 180, y1: 0, x2: 552, y2: 0, lineWidth: 1.5, lineColor: accent },
    ],
    alignment: "center",
    margin: [0, 10, 0, 10],
  };

  // ── Certificate title ──
  const titleSection = {
    text: certTitle.toUpperCase(),
    fontSize: 28,
    bold: true,
    color: color,
    alignment: "center",
    characterSpacing: 4,
    margin: [0, 0, 0, 8],
  };

  // ── Decorative divider below title ──
  const divider = {
    canvas: [
      { type: "line", x1: 240, y1: 0, x2: 492, y2: 0, lineWidth: 1, lineColor: accent },
    ],
    alignment: "center",
    margin: [0, 0, 0, 20],
  };

  // ── Presented to ──
  const presentedTo = {
    text: "This is proudly presented to",
    fontSize: 12,
    color: "#666666",
    alignment: "center",
    margin: [0, 0, 0, 12],
  };

  // ── Recipient name (large, elegant) ──
  const recipientSection = {
    text: recipientName,
    fontSize: 38,
    bold: true,
    color: color,
    alignment: "center",
    margin: [40, 0, 40, 8],
  };

  // ── Underline below name ──
  const nameUnderline = {
    canvas: [
      { type: "line", x1: 160, y1: 0, x2: 572, y2: 0, lineWidth: 1.5, lineColor: accent },
    ],
    alignment: "center",
    margin: [0, 0, 0, 16],
  };

  // ── Course description ──
  const courseSection = courseName ? {
    text: `For successfully completing ${courseName}`,
    fontSize: 13,
    color: "#444444",
    alignment: "center",
    margin: [60, 0, 60, 24],
  } : { text: "", margin: [0, 0, 0, 24] };

  // ── Date ──
  const dateSection = {
    text: dateIssued,
    fontSize: 11,
    color: "#666666",
    alignment: "center",
    margin: [0, 0, 0, 20],
  };

  // ── Bottom section: Issuer + QR Code ──
  const bottomColumns = {
    columns: [
      // Left spacer
      { width: "*", text: "" },
      // Center: Issuer with signature line
      {
        width: 250,
        alignment: "center",
        stack: [
          { canvas: [{ type: "line", x1: 40, y1: 0, x2: 210, y2: 0, lineWidth: 1, lineColor: "#999999" }] },
          issuerName ? { text: issuerName, fontSize: 12, bold: true, color: color, alignment: "center", margin: [0, 6, 0, 0] } : null,
          issuerTitle ? { text: issuerTitle, fontSize: 9, color: "#888888", alignment: "center", margin: [0, 2, 0, 0] } : null,
        ].filter(Boolean),
      },
      // Right: QR Code (if available)
      qrDataUrl ? {
        width: 80,
        alignment: "right",
        stack: [
          { image: qrDataUrl, width: 60, height: 60 },
          { text: `ID: ${verifyId || ""}`, fontSize: 6, color: "#aaaaaa", alignment: "center", margin: [0, 2, 0, 0] },
        ],
      } : { width: 80, text: "" },
    ],
    margin: [40, 0, 40, 0],
  };

  // ── Assemble document ──
  return {
    pageSize,
    pageOrientation: "landscape",
    pageMargins: [mm(20), mm(20), mm(20), options.watermark ? mm(18) + 14 : mm(18)],
    content: [
      borderCanvas,
      { text: "✦", fontSize: 16, color: accent, alignment: "center", margin: [0, 10, 0, 0] },
      topOrnament,
      titleSection,
      divider,
      presentedTo,
      recipientSection,
      nameUnderline,
      courseSection,
      dateSection,
      bottomColumns,
    ],
    defaultStyle: {
      font: "Roboto",
      fontSize: 11,
      lineHeight: 1.4,
      color: "#1a1a1a",
    },
    footer: options.watermark
      ? (currentPage, pageCount) => ({
          text: "Generated by BuildCertificates — buildcertificates.com",
          alignment: "center", fontSize: 7, color: "#bbbbbb", margin: [mm(15), 4, mm(15), 0],
        })
      : undefined,
  };
};
