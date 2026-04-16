/* ============================================================
   elegant.js — "Prestige" — Classic Academy Layout
   Full-width cream, gold double-border frame, centered 4-zone
   structure: header | recipient hero | achievement | footer
   ============================================================ */

module.exports = function elegantTemplate(data, options = {}) {
  const navy  = '#1B365D';
  const gold  = '#C9A84C';
  const cream = '#F9F6EE';

  const { recipient = {}, certificate = {}, qrDataUrl } = data;
  const recipientName = recipient.name           || 'Recipient Name';
  const certTitle     = certificate.title        || 'Certificate of Completion';
  const courseName    = certificate.course       || '';
  const issuerName    = certificate.issuer       || '';
  const issuerTitle   = certificate.issuer_title || '';
  const watermark     = options.watermark || false;
  const rawDate       = certificate.date
    ? new Date(certificate.date + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const qrHtml = qrDataUrl
    ? `<img src="${qrDataUrl}" style="width:52px;height:52px;border:1.5px solid ${gold};padding:2px;display:block;" alt="Verify"/>`
    : '';

  // Simple gold L-bracket corner ornament (top-left; mirrored via CSS transform)
  const corner = `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" style="width:56px;height:56px;display:block;">
    <line x1="0" y1="1.25" x2="56" y2="1.25" stroke="${gold}" stroke-width="2.5"/>
    <line x1="1.25" y1="0" x2="1.25" y2="56" stroke="${gold}" stroke-width="2.5"/>
    <line x1="6" y1="6" x2="50" y2="6" stroke="${gold}" stroke-width="0.8" opacity="0.5"/>
    <line x1="6" y1="6" x2="6" y2="50" stroke="${gold}" stroke-width="0.8" opacity="0.5"/>
    <rect x="0" y="0" width="18" height="18" fill="${gold}" opacity="0.08"/>
    <circle cx="14" cy="14" r="3.5" fill="${gold}"/>
  </svg>`;

  // Top ornamental flourish rule (below title, above "presented to")
  const flourish = `<svg viewBox="0 0 680 22" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:680px;height:22px;display:block;margin:0 auto;">
    <line x1="0" y1="11" x2="310" y2="11" stroke="${gold}" stroke-width="0.8" opacity="0.6"/>
    <line x1="370" y1="11" x2="680" y2="11" stroke="${gold}" stroke-width="0.8" opacity="0.6"/>
    <rect x="330" y="7" width="8" height="8" fill="${gold}" transform="rotate(45,334,11)"/>
    <rect x="320" y="8.5" width="5" height="5" fill="${gold}" opacity="0.5" transform="rotate(45,322.5,11)"/>
    <rect x="345" y="8.5" width="5" height="5" fill="${gold}" opacity="0.5" transform="rotate(45,347.5,11)"/>
    <line x1="308" y1="11" x2="295" y2="11" stroke="${gold}" stroke-width="2" opacity="0.3"/>
    <line x1="372" y1="11" x2="385" y2="11" stroke="${gold}" stroke-width="2" opacity="0.3"/>
    <line x1="150" y1="8" x2="150" y2="14" stroke="${gold}" stroke-width="0.8" opacity="0.4"/>
    <line x1="530" y1="8" x2="530" y2="14" stroke="${gold}" stroke-width="0.8" opacity="0.4"/>
  </svg>`;

  // Name underline rule
  const nameRule = `<svg viewBox="0 0 520 12" xmlns="http://www.w3.org/2000/svg" style="width:520px;max-width:100%;height:12px;display:block;margin:0 auto;">
    <line x1="0" y1="6" x2="240" y2="6" stroke="${gold}" stroke-width="1.5"/>
    <rect x="254" y="2" width="8" height="8" fill="${gold}" transform="rotate(45,258,6)"/>
    <rect x="246" y="3.5" width="5" height="5" fill="${gold}" opacity="0.5" transform="rotate(45,248.5,6)"/>
    <rect x="267" y="3.5" width="5" height="5" fill="${gold}" opacity="0.5" transform="rotate(45,269.5,6)"/>
    <line x1="280" y1="6" x2="520" y2="6" stroke="${gold}" stroke-width="1.5"/>
  </svg>`;

  // Circular seal — laurel + shield
  const sealSvg = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="width:80px;height:80px;">
    <circle cx="40" cy="40" r="38" fill="none" stroke="${gold}" stroke-width="2"/>
    <circle cx="40" cy="40" r="31" fill="none" stroke="${gold}" stroke-width="0.7" stroke-dasharray="3,3"/>
    <path d="M16,48 Q10,40 13,31 Q16,23 22,26 Q17,34 19,41 Q21,47 16,48Z" fill="${gold}" opacity="0.7"/>
    <path d="M64,48 Q70,40 67,31 Q64,23 58,26 Q63,34 61,41 Q59,47 64,48Z" fill="${gold}" opacity="0.7"/>
    <path d="M20,56 Q12,48 15,39 Q18,30 25,33 Q20,41 22,48 Q24,54 20,56Z" fill="${gold}" opacity="0.5"/>
    <path d="M60,56 Q68,48 65,39 Q62,30 55,33 Q60,41 58,48 Q56,54 60,56Z" fill="${gold}" opacity="0.5"/>
    <path d="M40,14 L56,20 L56,40 Q56,55 40,64 Q24,55 24,40 L24,20 Z" fill="${navy}" opacity="0.85"/>
    <path d="M40,18 L52,23 L52,40 Q52,52 40,60 Q28,52 28,40 L28,23 Z" fill="none" stroke="${gold}" stroke-width="1" opacity="0.5"/>
    <rect x="33" y="30" width="14" height="10" rx="0.5" fill="none" stroke="${gold}" stroke-width="1.2"/>
    <line x1="40" y1="30" x2="40" y2="40" stroke="${gold}" stroke-width="0.9"/>
    <line x1="35" y1="33.5" x2="39" y2="33.5" stroke="${gold}" stroke-width="0.7"/>
    <line x1="35" y1="36.5" x2="39" y2="36.5" stroke="${gold}" stroke-width="0.7"/>
    <line x1="41" y1="33.5" x2="45" y2="33.5" stroke="${gold}" stroke-width="0.7"/>
    <line x1="41" y1="36.5" x2="45" y2="36.5" stroke="${gold}" stroke-width="0.7"/>
    <line x1="32" y1="68" x2="48" y2="68" stroke="${gold}" stroke-width="0.5" opacity="0.5"/>
  </svg>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Cinzel:wght@400;600;700&family=Dancing+Script:wght@600;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:11in; height:8.5in; overflow:hidden; background:${cream}; }

  .page {
    width:11in; height:8.5in;
    position:relative;
    background:${cream};
    display:flex; flex-direction:column;
  }

  /* ── Corner ornaments ── */
  .corner { position:absolute; z-index:6; line-height:0; }
  .c-tl { top:0; left:0; }
  .c-tr { top:0; right:0; transform:scaleX(-1); }
  .c-bl { bottom:0; left:0; transform:scaleY(-1); }
  .c-br { bottom:0; right:0; transform:scale(-1); }

  /* ── Border frame (between corner ornaments) ── */
  .bh { position:absolute; left:56px; right:56px; height:2.5px; background:${gold}; z-index:5; }
  .bv { position:absolute; top:56px; bottom:56px; width:2.5px; background:${gold}; z-index:5; }
  .bht { top:1.25px; } .bhb { bottom:1.25px; }
  .bvl { left:1.25px; } .bvr { right:1.25px; }

  /* Inner frame */
  .bhi { position:absolute; left:62px; right:62px; height:0.8px; background:${gold}; opacity:0.45; z-index:5; }
  .bvi { position:absolute; top:62px; bottom:62px; width:0.8px; background:${gold}; opacity:0.45; z-index:5; }
  .bhit { top:7px; } .bhib { bottom:7px; }
  .bvil { left:7px; } .bvir { right:7px; }

  /* ── Content ── */
  .content {
    position:absolute;
    inset:0.52in;
    display:flex; flex-direction:column; align-items:center;
    z-index:2;
  }

  /* Zone 1 — Header */
  .zone-header {
    width:100%;
    display:flex; flex-direction:column; align-items:center;
    padding-bottom:0.14in;
    border-bottom:0; /* flourish acts as separator */
  }

  .cert-title {
    font-family:'Cinzel',serif; font-size:30px; font-weight:700;
    color:${navy}; letter-spacing:7px; text-transform:uppercase;
    text-align:center; margin-bottom:0.16in;
  }

  /* Zone 2 — Recipient hero */
  .zone-recipient {
    flex:1;
    width:100%;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:0.08in 0 0.08in;
  }

  .presented {
    font-family:'EB Garamond',serif; font-style:italic;
    font-size:20px; color:#999; text-align:center;
    margin-bottom:0.1in;
  }

  .recipient-name {
    font-family:'Playfair Display',serif; font-size:78px; font-weight:800;
    color:${navy}; text-align:center; line-height:1;
    letter-spacing:-1px; margin-bottom:0.1in;
  }

  /* Zone 3 — Achievement */
  .zone-achievement {
    width:100%;
    display:flex; flex-direction:column; align-items:center;
    padding:0.06in 0 0.14in;
  }

  .course-intro {
    font-family:'EB Garamond',serif; font-style:italic;
    font-size:18px; color:#999; text-align:center; margin-bottom:0.07in;
  }
  .course-name {
    font-family:'Cinzel',serif; font-size:24px; font-weight:700;
    color:${navy}; letter-spacing:3px; text-transform:uppercase; text-align:center;
  }

  /* Zone 4 — Footer */
  .zone-footer {
    width:100%;
    display:flex; align-items:flex-end; justify-content:space-between;
    padding-top:0.15in;
    border-top:1px solid rgba(201,168,76,0.3);
    min-height:0.9in;
  }

  .footer-col { display:flex; flex-direction:column; justify-content:flex-end; }

  .f-label  { font-family:'EB Garamond',serif; font-size:12px; color:#bbb; text-transform:uppercase; letter-spacing:2px; margin-bottom:4px; }
  .f-date   { font-family:'EB Garamond',serif; font-size:16px; color:#777; }
  .f-org    { font-family:'Cinzel',serif; font-size:14px; font-weight:600; color:${navy}; letter-spacing:1px; margin-top:2px; }
  .f-qr     { margin-top:6px; }

  .sig-wrap  { display:flex; flex-direction:column; align-items:center; }
  .sig-script { font-family:'Dancing Script',cursive; font-size:32px; color:#444; line-height:1; margin-bottom:6px; }
  .sig-line   { width:220px; height:1px; background:#ccc; margin-bottom:6px; }
  .sig-name   { font-family:'EB Garamond',serif; font-size:15px; color:#555; text-align:center; }
  .sig-title  { font-family:'EB Garamond',serif; font-style:italic; font-size:13px; color:#999; text-align:center; }

  .seal-wrap { display:flex; align-items:flex-end; justify-content:flex-end; }

  .watermark { position:absolute; bottom:3px; left:0; right:0; text-align:center; font-size:8px; color:#ccc; font-family:'EB Garamond',serif; z-index:5; }
</style>
</head>
<body>
<div class="page">

  <!-- Border frame -->
  <div class="bh bht"></div><div class="bh bhb"></div>
  <div class="bv bvl"></div><div class="bv bvr"></div>
  <div class="bhi bhit"></div><div class="bhi bhib"></div>
  <div class="bvi bvil"></div><div class="bvi bvir"></div>

  <!-- Corner ornaments -->
  <div class="corner c-tl">${corner}</div>
  <div class="corner c-tr">${corner}</div>
  <div class="corner c-bl">${corner}</div>
  <div class="corner c-br">${corner}</div>

  <!-- Content -->
  <div class="content">

    <!-- Zone 1: Header -->
    <div class="zone-header">
      <div class="cert-title">${certTitle}</div>
      ${flourish}
    </div>

    <!-- Zone 2: Recipient -->
    <div class="zone-recipient">
      <div class="presented">This certificate is proudly presented to</div>
      <div class="recipient-name">${recipientName}</div>
      ${nameRule}
    </div>

    <!-- Zone 3: Achievement -->
    <div class="zone-achievement">
      ${courseName ? `<div class="course-intro">For successfully completing</div>
      <div class="course-name">${courseName}</div>` : ''}
    </div>

    <!-- Zone 4: Footer -->
    <div class="zone-footer">

      <!-- Left: Date + QR -->
      <div class="footer-col">
        <div class="f-label">Date Issued</div>
        <div class="f-date">${rawDate}</div>
        ${issuerName ? `<div class="f-org">${issuerName}</div>` : ''}
        ${qrHtml ? `<div class="f-qr">${qrHtml}</div>` : ''}
      </div>

      <!-- Center: Signature -->
      <div class="footer-col">
        <div class="sig-wrap">
          <div class="sig-script">${issuerName || 'Signature'}</div>
          <div class="sig-line"></div>
          ${issuerName  ? `<div class="sig-name">${issuerName}</div>` : ''}
          ${issuerTitle ? `<div class="sig-title">${issuerTitle}</div>` : ''}
        </div>
      </div>

      <!-- Right: Seal -->
      <div class="footer-col">
        <div class="seal-wrap">${sealSvg}</div>
      </div>

    </div>
  </div>

  ${watermark ? '<div class="watermark">Generated by BuildCertificates.com</div>' : ''}
</div>
</body>
</html>`;
};
