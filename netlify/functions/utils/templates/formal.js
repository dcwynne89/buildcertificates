/* ============================================================
   formal.js — Formal/academic certificate template for pdfmake
   Target: parchment background, ornate double border, flourish
   divider, course name prominent & uppercase, seal left +
   signature right + QR bottom-right.
   ============================================================ */

const mm = (v) => v * 2.8346;

module.exports = function formalTemplate(data, options = {}) {
  const color    = options.color || "#6B1D2A";   // Burgundy/maroon
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
  const pad = 22;

  // ── Parchment background + double border ──
  const background = () => ({
    absolutePosition: { x: 0, y: 0 },
    canvas: [
      // Parchment fill
      { type: "rect", x: 0,    y: 0,    w: W,          h: H,          color: "#F9F3E3" },
      // Thick outer border
      { type: "rect", x: pad,  y: pad,  w: W-pad*2,    h: H-pad*2,    lineWidth: 4, lineColor: color },
      // Thin inner border
      { type: "rect", x: pad+8, y: pad+8, w: W-pad*2-16, h: H-pad*2-16, lineWidth: 1, lineColor: color },
    ],
  });

  // ── Title ──
  const titleSection = {
    text: certTitle,
    fontSize: 28,
    bold: true,
    color: color,
    alignment: "center",
    margin: [0, 16, 0, 6],
  };

  // ── Ornate flourish divider (text-based) ──
  const flourish = {
    text: "───── ✦ ─────",
    fontSize: 11,
    color: color,
    alignment: "center",
    margin: [0, 2, 0, 12],
  };

  // ── Presented to ──
  const presentedTo = {
    text: "Presented to",
    fontSize: 12,
    italics: true,
    color: "#555555",
    alignment: "center",
    margin: [0, 0, 0, 6],
  };

  // ── Recipient name ──
  const recipientSection = {
    text: recipientName,
    fontSize: 40,
    bold: true,
    italics: true,
    color: "#111111",
    alignment: "center",
    margin: [60, 0, 60, 6],
  };

  // ── Name underline ──
  const nameUnderline = {
    canvas: [
      { type: "line", x1: 200, y1: 0, x2: 542, y2: 0, lineWidth: 1, lineColor: "#cccccc" },
    ],
    margin: [0, 0, 0, 10],
  };

  // ── Course description ──
  const courseSection = courseName ? [
    {
      text: "In recognition of successfully completing all requirements for the course",
      fontSize: 11,
      italics: true,
      color: "#444444",
      alignment: "center",
      margin: [80, 0, 80, 4],
    },
    {
      text: courseName.toUpperCase(),
      fontSize: 16,
      bold: true,
      color: color,
      alignment: "center",
      characterSpacing: 2,
      margin: [40, 0, 40, 10],
    },
  ] : [{ text: "", margin: [0, 0, 0, 10] }];

  // ── Date ──
  const dateSection = {
    text: rawDate,
    fontSize: 11,
    color: "#777777",
    alignment: "center",
    margin: [0, 0, 0, 10],
  };

  // ── Bottom: Seal left | Signature center | QR right ──
  const bottomRow = {
    columns: [
      // Left: Circular seal
      {
        width: 90,
        alignment: "center",
        stack: [
          {
            canvas: [
              { type: "ellipse", x: 36, y: 36, r1: 34, r2: 34, lineWidth: 2.5, lineColor: color },
              { type: "ellipse", x: 36, y: 36, r1: 27, r2: 27, lineWidth: 1,   lineColor: color },
            ],
          },
          { text: "EST.", fontSize: 6.5, bold: true, color: color, alignment: "center", margin: [0, -58, 0, 0] },
          { text: "✦", fontSize: 10, color: color, alignment: "center", margin: [0, 2, 0, 0] },
          { text: "OFFICIAL", fontSize: 6, bold: true, color: color, alignment: "center", margin: [0, 2, 0, 0] },
          { text: "SEAL", fontSize: 6, color: color, alignment: "center", margin: [0, 1, 0, 22] },
        ],
      },
      // Center: Signature block
      {
        width: "*",
        alignment: "center",
        margin: [0, 20, 0, 0],
        stack: [
          { canvas: [{ type: "line", x1: 40, y1: 0, x2: 260, y2: 0, lineWidth: 1, lineColor: "#999999" }] },
          issuerName  ? { text: issuerName,  fontSize: 11, bold: true, color: "#222222", alignment: "center", margin: [0, 5, 0, 0] } : null,
          issuerTitle ? { text: issuerTitle, fontSize: 9,  color: "#888888", alignment: "center", margin: [0, 2, 0, 0] } : null,
        ].filter(Boolean),
      },
      // Right: QR
      qrDataUrl ? {
        width: 80,
        alignment: "right",
        stack: [
          { image: qrDataUrl, width: 58, height: 58, margin: [0, 10, 0, 0] },
          { text: verifyId || "", fontSize: 5.5, color: "#aaaaaa", alignment: "center", margin: [0, 2, 0, 0] },
        ],
      } : { width: 80, text: "" },
    ],
    margin: [40, 0, 40, 0],
  };

  return {
    pageSize,
    pageOrientation: "landscape",
    pageMargins: [pad + 16, pad + 14, pad + 16, options.watermark ? pad + 12 + 14 : pad + 12],
    background,
    content: [
      titleSection,
      flourish,
      presentedTo,
      recipientSection,
      nameUnderline,
      ...courseSection,
      dateSection,
      bottomRow,
    ],
    defaultStyle: {
      font: "Roboto",
      fontSize: 11,
      lineHeight: 1.35,
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
