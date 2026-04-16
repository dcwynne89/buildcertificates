/* ============================================================
   modern.js — "Executive" — Bold Corporate Layout
   White bg, full-width gradient header, ALL centered text,
   3-zone body: presented / name hero / achievement,
   3-column footer: org+date | signature | QR
   ============================================================ */

module.exports = function modernTemplate(data, options = {}) {
  const colorA  = '#3730A3';  // Indigo
  const colorB  = '#7C3AED';  // Purple
  const color   = options.color || colorA;

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
    ? `<img src="${qrDataUrl}" style="width:58px;height:58px;display:block;" alt="Verify"/>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Dancing+Script:wght@600;700&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:11in; height:8.5in; overflow:hidden; background:#fff; }

  .page {
    width:11in; height:8.5in;
    position:relative;
    background:#fff;
    display:flex; flex-direction:column;
    /* Subtle outer border */
    outline: 1px solid #e8e8e8;
  }

  /* ── Header ── */
  .header {
    flex-shrink:0;
    height:1.8in;
    background:linear-gradient(135deg, ${color} 0%, ${colorB} 100%);
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:0 0.8in;
    position:relative;
  }
  /* Subtle sheen at bottom of header */
  .header::after {
    content:''; position:absolute; bottom:0; left:0; right:0;
    height:3px; background:rgba(255,255,255,0.2);
  }

  .header-eyebrow {
    font-family:'Inter',sans-serif; font-size:13px; font-weight:500;
    color:rgba(255,255,255,0.6); letter-spacing:6px; text-transform:uppercase;
    margin-bottom:10px;
  }
  .header-title {
    font-family:'Inter',sans-serif; font-size:42px; font-weight:800;
    color:#fff; letter-spacing:4px; text-transform:uppercase;
    text-align:center; line-height:1; margin-bottom:14px;
  }
  .header-rule {
    width:240px; height:1px; background:rgba(255,255,255,0.35);
  }

  /* ── Body ── */
  .body {
    flex:1;
    display:flex; flex-direction:column; align-items:center;
    padding:0.42in 0.8in 0;
  }

  /* Zone 2: Recipient */
  .zone-recipient {
    display:flex; flex-direction:column; align-items:center;
    width:100%;
  }

  .presented {
    font-family:'Inter',sans-serif; font-size:16px; font-weight:400;
    color:#bbb; letter-spacing:4px; text-transform:uppercase;
    text-align:center; margin-bottom:0.1in;
  }
  .recipient-name {
    font-family:'Inter',sans-serif; font-size:85px; font-weight:900;
    color:#0f0f0f; text-align:center; line-height:1;
    letter-spacing:-3px; margin-bottom:0.14in;
  }
  /* Color accent bar below name */
  .name-accent {
    width:72px; height:5px;
    background:${color}; border-radius:3px;
    margin-bottom:0.16in;
  }

  /* Zone 3: Achievement */
  .zone-achievement {
    display:flex; flex-direction:column; align-items:center;
    width:100%; flex:1; justify-content:flex-start;
  }
  .course-intro { font-family:'Inter',sans-serif; font-size:22px; font-weight:400; color:#aaa; text-align:center; }
  .course-name  { font-family:'Inter',sans-serif; font-size:24px; font-weight:700; color:#333; text-align:center; margin-top:4px; }

  /* ── Footer ── */
  .footer {
    flex-shrink:0;
    display:flex; align-items:flex-end; justify-content:space-between;
    padding:0.14in 0.8in 0.38in;
    border-top:1.5px solid ${color};
    /* The accent color top-border makes a strong visual separator */
    margin-top:auto;
  }

  /* Footer left: org + date */
  .footer-left { display:flex; flex-direction:column; gap:4px; min-width:2in; }
  .f-org  { font-family:'Inter',sans-serif; font-size:18px; font-weight:700; color:#111; }
  .f-sub  { font-family:'Inter',sans-serif; font-size:15px; color:#888; }
  .f-date { font-family:'Inter',sans-serif; font-size:15px; color:#aaa; margin-top:2px; }

  /* Footer center: signature */
  .footer-center { display:flex; flex-direction:column; align-items:center; flex:1; max-width:2.5in; }
  .sig-script { font-family:'Dancing Script',cursive; font-size:34px; color:#333; line-height:1; margin-bottom:6px; }
  .sig-line   { width:200px; height:1px; background:#ddd; margin-bottom:6px; }
  .sig-name   { font-family:'Inter',sans-serif; font-size:14px; font-weight:600; color:#555; text-align:center; }
  .sig-label  { font-family:'Inter',sans-serif; font-size:12px; color:#bbb; letter-spacing:2px; margin-top:2px; }

  /* Footer right: QR */
  .footer-right { display:flex; flex-direction:column; align-items:flex-end; justify-content:flex-end; min-width:1in; }
  .qr-label { font-family:'Inter',sans-serif; font-size:10px; color:#ccc; letter-spacing:1px; text-transform:uppercase; margin-top:5px; text-align:center; }

  .watermark { text-align:center; font-size:8px; color:#ddd; padding:2px 0; font-family:'Inter',sans-serif; }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="header-eyebrow">Official Document</div>
    <div class="header-title">${certTitle}</div>
    <div class="header-rule"></div>
  </div>

  <!-- Body -->
  <div class="body">

    <!-- Zone 2: Recipient -->
    <div class="zone-recipient">
      <div class="presented">Proudly presented to</div>
      <div class="recipient-name">${recipientName}</div>
      <div class="name-accent"></div>
    </div>

    <!-- Zone 3: Achievement -->
    <div class="zone-achievement">
      ${courseName
        ? `<div class="course-intro">For successfully completing</div>
           <div class="course-name">${courseName}</div>`
        : ''}
    </div>

  </div>

  <!-- Footer: 3-column -->
  <div class="footer">

    <!-- Left: Organization + Date -->
    <div class="footer-left">
      ${issuerName  ? `<div class="f-org">${issuerName}</div>` : ''}
      ${issuerTitle ? `<div class="f-sub">${issuerTitle}</div>` : ''}
      <div class="f-date">${rawDate}</div>
    </div>

    <!-- Center: Signature -->
    <div class="footer-center">
      <div class="sig-script">${issuerName || 'Signature'}</div>
      <div class="sig-line"></div>
      ${issuerName  ? `<div class="sig-name">${issuerName}</div>` : ''}
      <div class="sig-label">Authorized Signature</div>
    </div>

    <!-- Right: QR -->
    <div class="footer-right">
      ${qrHtml}
      ${qrHtml ? '<div class="qr-label">Verify</div>' : ''}
    </div>

  </div>

  ${watermark ? '<div class="watermark">Generated by BuildCertificates.com</div>' : ''}
</div>
</body>
</html>`;
};
