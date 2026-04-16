/* ============================================================
   formal.js — "Heritage" — Dark Grand Layout
   Midnight navy, gold double-border, 140px corner ornaments,
   4-zone centered layout: header | recipient hero | achievement
   3-column footer: medallion | signature | date+QR
   ============================================================ */

module.exports = function formalTemplate(data, options = {}) {
  const bg       = '#0F1729';
  const gold     = '#C9A84C';
  const goldL    = '#E8CB7A';
  const cream    = '#F5ECD7';

  const { recipient = {}, certificate = {}, qrDataUrl } = data;
  const recipientName = recipient.name           || 'Recipient Name';
  const certTitle     = certificate.title        || 'Certificate of Achievement';
  const courseName    = certificate.course       || '';
  const issuerName    = certificate.issuer       || '';
  const issuerTitle   = certificate.issuer_title || '';
  const watermark     = options.watermark || false;
  const rawDate       = certificate.date
    ? new Date(certificate.date + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const qrHtml = qrDataUrl
    ? `<img src="${qrDataUrl}" style="width:56px;height:56px;border:1.5px solid ${gold};padding:3px;background:#fff;display:block;" alt="Verify"/>`
    : '';

  // Corner ornament — 140px, gold L-bracket with filled diamond
  const corner = `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" style="width:140px;height:140px;display:block;">
    <!-- Outer L lines (form edges of border) -->
    <line x1="0" y1="1.25" x2="140" y2="1.25" stroke="${gold}" stroke-width="2.5"/>
    <line x1="1.25" y1="0"  x2="1.25" y2="140" stroke="${gold}" stroke-width="2.5"/>
    <!-- Inner echo lines -->
    <line x1="8" y1="8" x2="132" y2="8"  stroke="${gold}" stroke-width="0.8" opacity="0.45"/>
    <line x1="8" y1="8" x2="8"  y2="132" stroke="${gold}" stroke-width="0.8" opacity="0.45"/>
    <!-- Filled corner block -->
    <rect x="0" y="0" width="34" height="34" fill="${gold}" opacity="0.1"/>
    <!-- Diamond accent at inner junction of L -->
    <rect x="21" y="21" width="14" height="14" fill="${gold}" transform="rotate(45,28,28)"/>
    <!-- Decorative tick marks along each arm -->
    <line x1="60"  y1="0" x2="60"  y2="8" stroke="${gold}" stroke-width="1" opacity="0.5"/>
    <line x1="100" y1="0" x2="100" y2="8" stroke="${gold}" stroke-width="1" opacity="0.5"/>
    <line x1="0" y1="60"  x2="8"  y2="60"  stroke="${gold}" stroke-width="1" opacity="0.5"/>
    <line x1="0" y1="100" x2="8"  y2="100" stroke="${gold}" stroke-width="1" opacity="0.5"/>
    <!-- Small accent dots -->
    <circle cx="60"  cy="4" r="2" fill="${gold}" opacity="0.6"/>
    <circle cx="100" cy="4" r="2" fill="${gold}" opacity="0.6"/>
    <circle cx="4" cy="60"  r="2" fill="${gold}" opacity="0.6"/>
    <circle cx="4" cy="100" r="2" fill="${gold}" opacity="0.6"/>
  </svg>`;

  // Ornamental flourish divider (below title)
  const flourish = `<svg viewBox="0 0 700 32" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;height:32px;display:block;margin:0 auto;">
    <!-- Central diamond cluster -->
    <rect x="343" y="11" width="14" height="14" fill="${gold}" transform="rotate(45,350,18)"/>
    <rect x="335" y="14.5" width="7" height="7" fill="${gold}" opacity="0.45" transform="rotate(45,338.5,18)"/>
    <rect x="358" y="14.5" width="7" height="7" fill="${gold}" opacity="0.45" transform="rotate(45,361.5,18)"/>
    <!-- Main rules -->
    <line x1="0"   y1="18" x2="320" y2="18" stroke="${gold}" stroke-width="0.8" opacity="0.55"/>
    <line x1="380" y1="18" x2="700" y2="18" stroke="${gold}" stroke-width="0.8" opacity="0.55"/>
    <!-- Scroll curves into center diamond -->
    <path d="M320,18 Q330,18 330,10 Q330,3 341,3" stroke="${gold}" stroke-width="1.2" fill="none"/>
    <path d="M380,18 Q370,18 370,10 Q370,3 359,3" stroke="${gold}" stroke-width="1.2" fill="none"/>
    <!-- Secondary accent lines -->
    <line x1="0"   y1="22" x2="305" y2="22" stroke="${gold}" stroke-width="0.4" opacity="0.25"/>
    <line x1="395" y1="22" x2="700" y2="22" stroke="${gold}" stroke-width="0.4" opacity="0.25"/>
    <!-- Smaller scrolls further out -->
    <path d="M240,18 Q250,18 250,12 Q250,7 258,7" stroke="${gold}" stroke-width="0.7" fill="none" opacity="0.5"/>
    <path d="M460,18 Q450,18 450,12 Q450,7 442,7" stroke="${gold}" stroke-width="0.7" fill="none" opacity="0.5"/>
    <circle cx="258" cy="7" r="2" fill="${gold}" opacity="0.4"/>
    <circle cx="442" cy="7" r="2" fill="${gold}" opacity="0.4"/>
  </svg>`;

  // Name underline rule (gold gradient)
  const nameRule = `<svg viewBox="0 0 540 10" xmlns="http://www.w3.org/2000/svg" style="width:540px;max-width:100%;height:10px;display:block;margin:0 auto;">
    <line x1="0"  y1="5" x2="255" y2="5" stroke="${gold}" stroke-width="1.5"/>
    <rect x="263" y="1" width="8" height="8" fill="${gold}" transform="rotate(45,267,5)"/>
    <rect x="255" y="2.5" width="5" height="5" fill="${gold}" opacity="0.5" transform="rotate(45,257.5,5)"/>
    <rect x="277" y="2.5" width="5" height="5" fill="${gold}" opacity="0.5" transform="rotate(45,279.5,5)"/>
    <line x1="282" y1="5" x2="540" y2="5" stroke="${gold}" stroke-width="1.5"/>
  </svg>`;

  // Medallion seal
  const notches = Array.from({length:24}, (_,i) => {
    const a = (i/24)*Math.PI*2;
    const x1=(55+48*Math.cos(a)).toFixed(1), y1=(55+48*Math.sin(a)).toFixed(1);
    const x2=(55+53*Math.cos(a)).toFixed(1), y2=(55+53*Math.sin(a)).toFixed(1);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${gold}" stroke-width="2"/>`;
  }).join('');
  const medal = `<svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg" style="width:110px;height:110px;">
    <circle cx="55" cy="55" r="53" fill="${bg}" stroke="${gold}" stroke-width="2.5"/>
    <circle cx="55" cy="55" r="46" fill="none" stroke="${gold}" stroke-width="0.8"/>
    <circle cx="55" cy="55" r="39" fill="none" stroke="${gold}" stroke-width="0.4" stroke-dasharray="2,3"/>
    ${notches}
    <!-- Laurel left -->
    <path d="M20,64 Q13,55 16,44 Q19,34 26,37 Q21,46 24,54 Q26,62 20,64Z" fill="${gold}" opacity="0.7"/>
    <path d="M24,73 Q15,65 18,54 Q21,44 29,47 Q24,56 26,64 Q28,71 24,73Z" fill="${gold}" opacity="0.5"/>
    <!-- Laurel right -->
    <path d="M90,64 Q97,55 94,44 Q91,34 84,37 Q89,46 86,54 Q84,62 90,64Z" fill="${gold}" opacity="0.7"/>
    <path d="M86,73 Q95,65 92,54 Q89,44 81,47 Q86,56 84,64 Q82,71 86,73Z" fill="${gold}" opacity="0.5"/>
    <!-- Shield -->
    <path d="M55,20 L75,27 L75,52 Q75,70 55,80 Q35,70 35,52 L35,27 Z" fill="${gold}" opacity="0.1"/>
    <path d="M55,20 L75,27 L75,52 Q75,70 55,80 Q35,70 35,52 L35,27 Z" fill="none" stroke="${gold}" stroke-width="1.8"/>
    <!-- Book -->
    <rect x="45" y="38" width="20" height="14" rx="1" fill="none" stroke="${goldL}" stroke-width="1.3"/>
    <line x1="55" y1="38" x2="55" y2="52" stroke="${goldL}" stroke-width="1"/>
    <line x1="48" y1="42" x2="54" y2="42" stroke="${goldL}" stroke-width="0.8"/>
    <line x1="48" y1="46" x2="54" y2="46" stroke="${goldL}" stroke-width="0.8"/>
    <line x1="56" y1="42" x2="62" y2="42" stroke="${goldL}" stroke-width="0.8"/>
    <line x1="56" y1="46" x2="62" y2="46" stroke="${goldL}" stroke-width="0.8"/>
    <!-- Globe -->
    <circle cx="55" cy="64" r="6" fill="none" stroke="${gold}" stroke-width="1"/>
    <line x1="49" y1="64" x2="61" y2="64" stroke="${gold}" stroke-width="0.7"/>
    <path d="M55,58 Q59,64 55,70" stroke="${gold}" stroke-width="0.7" fill="none"/>
    <path d="M55,58 Q51,64 55,70" stroke="${gold}" stroke-width="0.7" fill="none"/>
    <text x="55" y="94" font-family="sans-serif" font-size="5.5" font-weight="bold" fill="${gold}" text-anchor="middle" letter-spacing="1.5">OFFICIAL SEAL</text>
  </svg>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600;1,700&family=Dancing+Script:wght@600;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:11in; height:8.5in; overflow:hidden; background:${bg}; }

  .page {
    width:11in; height:8.5in;
    position:relative;
    background:${bg};
    display:flex; flex-direction:column;
  }
  /* Subtle radial glow on dark bg */
  .page::before {
    content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
    background:
      radial-gradient(ellipse at 30% 30%, rgba(201,168,76,0.05) 0%, transparent 55%),
      radial-gradient(ellipse at 70% 70%, rgba(201,168,76,0.04) 0%, transparent 55%);
  }

  /* ── Corner ornaments ── */
  .corner { position:absolute; z-index:6; line-height:0; }
  .c-tl { top:0; left:0; }
  .c-tr { top:0; right:0; transform:scaleX(-1); }
  .c-bl { bottom:0; left:0; transform:scaleY(-1); }
  .c-br { bottom:0; right:0; transform:scale(-1); }

  /* ── Border (between corner ornaments) ── */
  .bh { position:absolute; left:140px; right:140px; height:2.5px; background:${gold}; z-index:5; }
  .bv { position:absolute; top:140px; bottom:140px; width:2.5px; background:${gold}; z-index:5; }
  .bht { top:1.25px; } .bhb { bottom:1.25px; }
  .bvl { left:1.25px; } .bvr { right:1.25px; }
  /* Inner frame */
  .bhi { position:absolute; left:148px; right:148px; height:0.8px; background:${gold}; opacity:0.4; z-index:5; }
  .bvi { position:absolute; top:148px; bottom:148px; width:0.8px; background:${gold}; opacity:0.4; z-index:5; }
  .bhit { top:8px; } .bhib { bottom:8px; }
  .bvil { left:8px; } .bvir { right:8px; }

  /* ── Content ── */
  .content {
    position:absolute;
    /* Inside corner ornaments + some padding */
    top:0.55in; bottom:0; left:0.6in; right:0.6in;
    display:flex; flex-direction:column; align-items:center;
    z-index:2;
  }

  /* Zone 1: Header */
  .zone-header {
    display:flex; flex-direction:column; align-items:center;
    padding-bottom:0.12in; width:100%;
  }
  .cert-title {
    font-family:'Cinzel',serif; font-size:30px; font-weight:700;
    color:${gold}; letter-spacing:8px; text-transform:uppercase;
    text-align:center; margin-bottom:0.16in;
  }

  /* Zone 2: Recipient */
  .zone-recipient {
    flex:1;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:0.08in 0; width:100%;
  }
  .presented {
    font-family:'EB Garamond',serif; font-style:italic;
    font-size:20px; color:rgba(245,236,215,0.6);
    text-align:center; margin-bottom:0.1in;
  }
  .recipient-name {
    font-family:'Cormorant Garamond',serif; font-size:78px;
    font-weight:700; font-style:italic;
    color:${gold}; text-align:center; line-height:1;
    letter-spacing:1px; margin-bottom:0.1in;
    text-shadow:0 0 50px rgba(201,168,76,0.3), 0 2px 4px rgba(0,0,0,0.6);
  }

  /* Zone 3: Achievement */
  .zone-achievement {
    display:flex; flex-direction:column; align-items:center;
    padding:0.06in 0 0.16in; width:100%;
  }
  .recog-text {
    font-family:'EB Garamond',serif; font-style:italic;
    font-size:18px; color:rgba(245,236,215,0.6);
    text-align:center; line-height:1.5; margin-bottom:0.07in;
  }
  .course-name {
    font-family:'Cinzel',serif; font-size:26px; font-weight:700;
    color:${goldL}; letter-spacing:4px; text-transform:uppercase; text-align:center;
  }

  /* ── Footer ── */
  .footer {
    position:absolute;
    bottom:0; left:0.6in; right:0.6in;
    display:flex; align-items:flex-end; justify-content:space-between;
    padding-bottom:0.38in;
    z-index:2;
  }

  /* Footer separator line (just above footer, gold) */
  .footer-rule {
    position:absolute;
    bottom:0; left:0.6in; right:0.6in;
    height:1px; background:linear-gradient(90deg,transparent,${gold} 15%,${gold} 85%,transparent);
    opacity:0.3; z-index:2;
    /* positioned at top of footer zone */
    bottom:1.2in;
  }

  /* Left: medallion */
  .footer-left { flex-shrink:0; }

  /* Center: signature */
  .footer-center {
    flex:1; display:flex; flex-direction:column; align-items:center;
    padding:0 0.3in;
  }
  .sig-script { font-family:'Dancing Script',cursive; font-size:34px; color:${cream}; line-height:1; margin-bottom:6px; }
  .sig-line-g { width:220px; height:1px; background:linear-gradient(90deg,transparent,${gold} 25%,${gold} 75%,transparent); margin-bottom:7px; }
  .sig-name   { font-family:'Cinzel',serif; font-size:15px; font-weight:600; color:${gold}; letter-spacing:2px; text-align:center; }
  .sig-title  { font-family:'EB Garamond',serif; font-style:italic; font-size:13px; color:rgba(245,236,215,0.5); text-align:center; margin-top:2px; }
  .sig-date   { font-family:'EB Garamond',serif; font-size:16px; color:${gold}; opacity:0.65; margin-top:8px; text-align:center; }

  /* Right: date + QR */
  .footer-right {
    flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:6px;
  }
  .qr-label { font-family:'EB Garamond',serif; font-size:11px; color:${gold}; opacity:0.5; text-align:center; margin-top:4px; letter-spacing:1px; }

  .watermark { position:absolute; bottom:3px; left:0; right:0; text-align:center; font-size:8px; color:rgba(201,168,76,0.25); font-family:'EB Garamond',serif; z-index:7; }
</style>
</head>
<body>
<div class="page">

  <!-- Border frame -->
  <div class="bh bht"></div><div class="bh bhb"></div>
  <div class="bv bvl"></div><div class="bv bvr"></div>
  <div class="bhi bhit"></div><div class="bhi bhib"></div>
  <div class="bvi bvil"></div><div class="bvi bvir"></div>

  <!-- Corner ornaments (140px each) -->
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
      <div class="presented">Presented to</div>
      <div class="recipient-name">${recipientName}</div>
      ${nameRule}
    </div>

    <!-- Zone 3: Achievement -->
    <div class="zone-achievement">
      ${courseName
        ? `<div class="recog-text">In recognition of outstanding completion of</div>
           <div class="course-name">${courseName}</div>`
        : ''}
    </div>

  </div>

  <!-- Footer: 3-column -->
  <div class="footer">

    <!-- Left: Medallion seal -->
    <div class="footer-left">${medal}</div>

    <!-- Center: Signature -->
    <div class="footer-center">
      <div class="sig-script">${issuerName || 'Signature'}</div>
      <div class="sig-line-g"></div>
      ${issuerName  ? `<div class="sig-name">${issuerName}</div>` : ''}
      ${issuerTitle ? `<div class="sig-title">${issuerTitle}</div>` : ''}
      <div class="sig-date">${rawDate}</div>
    </div>

    <!-- Right: QR + label -->
    <div class="footer-right">
      ${qrHtml}
      ${qrHtml ? `<div class="qr-label">Scan to Verify</div>` : ''}
    </div>

  </div>

  ${watermark ? '<div class="watermark">Generated by BuildCertificates.com</div>' : ''}
</div>
</body>
</html>`;
};
