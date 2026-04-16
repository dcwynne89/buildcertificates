/* ============================================================
   formal.js — Formal/academic certificate template for pdfmake
   Traditional diploma, double border, centered, seal placeholder.
   ============================================================ */

const mm = (v) => v * 2.8346;

module.exports = function formalTemplate(data, options = {}) {
  const color = options.color || "#6B1D2A";   // Burgundy/maroon
  const pageSize = (options.pageSize || "letter").toUpperCase();

  const { recipient = {}, certificate = {}, verifyId, qrDataUrl } = data;
  const recipientName = recipient.name || "Recipient Name";
  const certTitle = certificate.title || "Certificate of Achievement";
  const courseName = certificate.course || "";
  const dateIssued = certificate.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const issuerName = certificate.issuer || "";
  const issuerTitle = certificate.issuer_title || "";

  // ── Double border frame ──
  const borderCanvas = {
    absolutePosition: { x: 25, y: 25 },
    canvas: [
      { type: "rect", x: 0, y: 0, w: 742, h: 562, r: 0, lineWidth: 3, lineColor: color },
      { type: "rect", x: 8, y: 8, w: 726, h: 546, r: 0, lineWidth: 1, lineColor: color },
    ],
  };

  // ── Decorative top flourish ──
  const topSection = {
    text: "— ✦ —",
    fontSize: 14,
    color: color,
    alignment: "center",
    margin: [0, 20, 0, 12],
  };

  // ── Title ──
  const titleSection = {
    text: certTitle,
    fontSize: 30,
    bold: true,
    color: color,
    alignment: "center",
    margin: [0, 0, 0, 6],
  };

  // ── Thin divider ──
  const divider = {
    canvas: [
      { type: "line", x1: 250, y1: 0, x2: 482, y2: 0, lineWidth: 1, lineColor: color },
    ],
    alignment: "center",
    margin: [0, 4, 0, 18],
  };

  // ── Presented to ──
  const presentedTo = {
    text: "This certificate is presented to",
    fontSize: 12,
    color: "#555555",
    alignment: "center",
    margin: [0, 0, 0, 14],
  };

  // ── Recipient ──
  const recipientSection = {
    text: recipientName,
    fontSize: 36,
    bold: true,
    color: "#111111",
    alignment: "center",
    margin: [50, 0, 50, 6],
  };

  // ── Name underline ──
  const nameUnderline = {
    canvas: [
      { type: "line", x1: 180, y1: 0, x2: 552, y2: 0, lineWidth: 1, lineColor: "#cccccc" },
    ],
    alignment: "center",
    margin: [0, 0, 0, 14],
  };

  // ── Course description ──
  const courseSection = courseName ? {
    text: `In recognition of completing ${courseName}`,
    fontSize: 12,
    color: "#444444",
    alignment: "center",
    margin: [60, 0, 60, 24],
  } : { text: "", margin: [0, 0, 0, 24] };

  // ── Date ──
  const dateSection = {
    text: dateIssued,
    fontSize: 11,
    color: "#777777",
    alignment: "center",
    margin: [0, 0, 0, 20],
  };

  // ── Bottom: Seal placeholder + Issuer + QR ──
  const bottomColumns = {
    columns: [
      // Left: Seal circle
      {
        width: 100,
        alignment: "center",
        stack: [
          {
            canvas: [
              { type: "ellipse", x: 35, y: 35, r1: 35, r2: 35, lineWidth: 2, lineColor: color },
              { type: "ellipse", x: 35, y: 35, r1: 28, r2: 28, lineWidth: 1, lineColor: color },
            ],
          },
          { text: "OFFICIAL", fontSize: 7, bold: true, color: color, alignment: "center", margin: [0, -45, 0, 0] },
          { text: "SEAL", fontSize: 6, color: color, alignment: "center", margin: [0, 2, 0, 30] },
        ],
      },
      // Center: Issuer
      {
        width: "*",
        alignment: "center",
        stack: [
          { canvas: [{ type: "line", x1: 60, y1: 0, x2: 240, y2: 0, lineWidth: 1, lineColor: "#999999" }], margin: [0, 30, 0, 0] },
          issuerName ? { text: issuerName, fontSize: 12, bold: true, color: "#222222", alignment: "center", margin: [0, 6, 0, 0] } : null,
          issuerTitle ? { text: issuerTitle, fontSize: 9, color: "#888888", alignment: "center", margin: [0, 2, 0, 0] } : null,
        ].filter(Boolean),
      },
      // Right: QR
      qrDataUrl ? {
        width: 80,
        alignment: "right",
        stack: [
          { image: qrDataUrl, width: 55, height: 55, margin: [0, 15, 0, 0] },
          { text: verifyId || "", fontSize: 6, color: "#aaaaaa", alignment: "center", margin: [0, 2, 0, 0] },
        ],
      } : { width: 80, text: "" },
    ],
    margin: [40, 0, 40, 0],
  };

  return {
    pageSize,
    pageOrientation: "landscape",
    pageMargins: [mm(22), mm(18), mm(22), options.watermark ? mm(18) + 14 : mm(16)],
    background: function () {
      return { canvas: [{ type: "rect", x: 0, y: 0, w: 792, h: 612, color: "#FEFCF7" }] };
    },
    content: [
      borderCanvas,
      topSection,
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
      ? () => ({
          text: "Generated by BuildCertificates — buildcertificates.com",
          alignment: "center", fontSize: 7, color: "#bbbbbb", margin: [mm(15), 4, mm(15), 0],
        })
      : undefined,
  };
};
