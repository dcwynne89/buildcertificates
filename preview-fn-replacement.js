  // -- Build preview HTML (mirrors Chromium templates exactly) --
  function buildPreviewHtml({ name, title, course, dateStr, issuer, issuerTitle, color, template }) {
    const e = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    // ================================================================
    // PRESTIGE (elegant) — Classic Academy
    // Full-width cream, gold double-border, centered 4-zone layout
    // ================================================================
    if (template === 'elegant') {
      const navy = '#1B365D', gold = '#C9A84C', cream = '#F9F6EE';

      const corner = `<svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" style="width:56px;height:56px;display:block;">
        <line x1="0" y1="1.25" x2="56" y2="1.25" stroke="${gold}" stroke-width="2.5"/>
        <line x1="1.25" y1="0" x2="1.25" y2="56" stroke="${gold}" stroke-width="2.5"/>
        <line x1="6" y1="6" x2="50" y2="6" stroke="${gold}" stroke-width="0.8" opacity="0.5"/>
        <line x1="6" y1="6" x2="6" y2="50" stroke="${gold}" stroke-width="0.8" opacity="0.5"/>
        <rect x="0" y="0" width="18" height="18" fill="${gold}" opacity="0.08"/>
        <circle cx="14" cy="14" r="3.5" fill="${gold}"/>
      </svg>`;

      const flourish = `<svg viewBox="0 0 680 22" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:680px;height:22px;display:block;margin:0 auto;">
        <line x1="0" y1="11" x2="310" y2="11" stroke="${gold}" stroke-width="0.8" opacity="0.6"/>
        <line x1="370" y1="11" x2="680" y2="11" stroke="${gold}" stroke-width="0.8" opacity="0.6"/>
        <rect x="330" y="7" width="8" height="8" fill="${gold}" transform="rotate(45,334,11)"/>
        <rect x="320" y="8.5" width="5" height="5" fill="${gold}" opacity="0.5" transform="rotate(45,322.5,11)"/>
        <rect x="345" y="8.5" width="5" height="5" fill="${gold}" opacity="0.5" transform="rotate(45,347.5,11)"/>
        <line x1="308" y1="11" x2="295" y2="11" stroke="${gold}" stroke-width="2" opacity="0.3"/>
        <line x1="372" y1="11" x2="385" y2="11" stroke="${gold}" stroke-width="2" opacity="0.3"/>
      </svg>`;

      const nameRule = `<svg viewBox="0 0 520 12" xmlns="http://www.w3.org/2000/svg" style="width:520px;max-width:100%;height:12px;display:block;margin:0 auto;">
        <line x1="0" y1="6" x2="240" y2="6" stroke="${gold}" stroke-width="1.5"/>
        <rect x="254" y="2" width="8" height="8" fill="${gold}" transform="rotate(45,258,6)"/>
        <rect x="246" y="3.5" width="5" height="5" fill="${gold}" opacity="0.5" transform="rotate(45,248.5,6)"/>
        <rect x="267" y="3.5" width="5" height="5" fill="${gold}" opacity="0.5" transform="rotate(45,269.5,6)"/>
        <line x1="280" y1="6" x2="520" y2="6" stroke="${gold}" stroke-width="1.5"/>
      </svg>`;

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
        <circle cx="40" cy="63" r="2.5" fill="${gold}"/>
      </svg>`;

      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Cinzel:wght@400;600;700&family=Dancing+Script:wght@600;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html,body{width:1100px;height:850px;overflow:hidden;background:${cream};}
        .page{width:1100px;height:850px;position:relative;background:${cream};display:flex;flex-direction:column;}
        /* Corner ornaments */
        .corner{position:absolute;z-index:6;line-height:0;}
        .c-tl{top:0;left:0;} .c-tr{top:0;right:0;transform:scaleX(-1);}
        .c-bl{bottom:0;left:0;transform:scaleY(-1);} .c-br{bottom:0;right:0;transform:scale(-1);}
        /* Border — between corners */
        .bh{position:absolute;left:56px;right:56px;height:2.5px;background:${gold};z-index:5;}
        .bv{position:absolute;top:56px;bottom:56px;width:2.5px;background:${gold};z-index:5;}
        .bht{top:1.25px;} .bhb{bottom:1.25px;} .bvl{left:1.25px;} .bvr{right:1.25px;}
        .bhi{position:absolute;left:62px;right:62px;height:0.8px;background:${gold};opacity:0.45;z-index:5;}
        .bvi{position:absolute;top:62px;bottom:62px;width:0.8px;background:${gold};opacity:0.45;z-index:5;}
        .bhit{top:7px;} .bhib{bottom:7px;} .bvil{left:7px;} .bvir{right:7px;}
        /* Content area */
        .content{position:absolute;inset:50px;display:flex;flex-direction:column;align-items:center;z-index:2;}
        /* Zone 1 — Header */
        .zone-header{width:100%;display:flex;flex-direction:column;align-items:center;padding-bottom:14px;}
        .cert-title{font-family:"Cinzel",serif;font-size:30px;font-weight:700;color:${navy};letter-spacing:7px;text-transform:uppercase;text-align:center;margin-bottom:16px;}
        /* Zone 2 — Recipient */
        .zone-recipient{flex:1;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 0;}
        .presented{font-family:"EB Garamond",serif;font-style:italic;font-size:20px;color:#999;text-align:center;margin-bottom:10px;}
        .recipient-name{font-family:"Playfair Display",serif;font-size:78px;font-weight:800;color:${navy};text-align:center;line-height:1;letter-spacing:-1px;margin-bottom:10px;}
        /* Zone 3 — Achievement */
        .zone-achievement{width:100%;display:flex;flex-direction:column;align-items:center;padding:6px 0 14px;}
        .course-intro{font-family:"EB Garamond",serif;font-style:italic;font-size:18px;color:#999;text-align:center;margin-bottom:7px;}
        .course-name{font-family:"Cinzel",serif;font-size:24px;font-weight:700;color:${navy};letter-spacing:3px;text-transform:uppercase;text-align:center;}
        /* Footer */
        .zone-footer{width:100%;display:flex;align-items:flex-end;justify-content:space-between;padding-top:14px;border-top:1px solid rgba(201,168,76,0.3);min-height:90px;}
        .footer-col{display:flex;flex-direction:column;justify-content:flex-end;}
        .f-label{font-family:"EB Garamond",serif;font-size:12px;color:#bbb;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;}
        .f-date{font-family:"EB Garamond",serif;font-size:16px;color:#777;}
        .f-org{font-family:"Cinzel",serif;font-size:14px;font-weight:600;color:${navy};letter-spacing:1px;margin-top:2px;}
        .sig-wrap{display:flex;flex-direction:column;align-items:center;}
        .sig-script{font-family:"Dancing Script",cursive;font-size:32px;color:#444;line-height:1;margin-bottom:6px;}
        .sig-line{width:220px;height:1px;background:#ccc;margin-bottom:6px;}
        .sig-name{font-family:"EB Garamond",serif;font-size:15px;color:#555;text-align:center;}
        .sig-title-text{font-family:"EB Garamond",serif;font-style:italic;font-size:13px;color:#999;text-align:center;}
        .seal-wrap{display:flex;align-items:flex-end;justify-content:flex-end;}
      </style></head><body><div class="page">
        <div class="bh bht"></div><div class="bh bhb"></div>
        <div class="bv bvl"></div><div class="bv bvr"></div>
        <div class="bhi bhit"></div><div class="bhi bhib"></div>
        <div class="bvi bvil"></div><div class="bvi bvir"></div>
        <div class="corner c-tl">${corner}</div><div class="corner c-tr">${corner}</div>
        <div class="corner c-bl">${corner}</div><div class="corner c-br">${corner}</div>
        <div class="content">
          <div class="zone-header">
            <div class="cert-title">${e(title)}</div>
            ${flourish}
          </div>
          <div class="zone-recipient">
            <div class="presented">This certificate is proudly presented to</div>
            <div class="recipient-name">${e(name)}</div>
            ${nameRule}
          </div>
          <div class="zone-achievement">
            ${course ? `<div class="course-intro">For successfully completing</div><div class="course-name">${e(course)}</div>` : ''}
          </div>
          <div class="zone-footer">
            <div class="footer-col"><div class="f-label">Date Issued</div><div class="f-date">${e(dateStr)}</div>${issuer ? `<div class="f-org">${e(issuer)}</div>` : ''}</div>
            <div class="footer-col"><div class="sig-wrap"><div class="sig-script">${e(issuer || 'Signature')}</div><div class="sig-line"></div>${issuer ? `<div class="sig-name">${e(issuer)}</div>` : ''}${issuerTitle ? `<div class="sig-title-text">${e(issuerTitle)}</div>` : ''}</div></div>
            <div class="footer-col"><div class="seal-wrap">${sealSvg}</div></div>
          </div>
        </div>
      </div></body></html>`;
    }

    // ================================================================
    // EXECUTIVE (modern) — Bold Corporate
    // White, gradient header, all centered, 3-col footer
    // ================================================================
    if (template === 'modern') {
      const c = color || '#3730A3';
      const cB = '#7C3AED';
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Dancing+Script:wght@600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html,body{width:1100px;height:850px;overflow:hidden;background:#fff;}
        .page{width:1100px;height:850px;background:#fff;display:flex;flex-direction:column;outline:1px solid #e8e8e8;}
        /* Header */
        .header{flex-shrink:0;height:190px;background:linear-gradient(135deg,${c} 0%,${cB} 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 80px;position:relative;}
        .header::after{content:"";position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(255,255,255,0.2);}
        .heyebrow{font-family:"Inter",sans-serif;font-size:13px;font-weight:500;color:rgba(255,255,255,0.6);letter-spacing:6px;text-transform:uppercase;margin-bottom:10px;}
        .htitle{font-family:"Inter",sans-serif;font-size:42px;font-weight:800;color:#fff;letter-spacing:4px;text-transform:uppercase;text-align:center;line-height:1;margin-bottom:14px;}
        .hrule{width:240px;height:1px;background:rgba(255,255,255,0.35);}
        /* Body */
        .body{flex:1;display:flex;flex-direction:column;align-items:center;padding:40px 80px 0;}
        /* Zone 2 — Recipient */
        .zone-recipient{display:flex;flex-direction:column;align-items:center;width:100%;}
        .presented{font-family:"Inter",sans-serif;font-size:16px;font-weight:400;color:#bbb;letter-spacing:4px;text-transform:uppercase;text-align:center;margin-bottom:10px;}
        .recipient-name{font-family:"Inter",sans-serif;font-size:85px;font-weight:900;color:#0f0f0f;text-align:center;line-height:1;letter-spacing:-3px;margin-bottom:14px;}
        .name-accent{width:72px;height:5px;background:${c};border-radius:3px;margin-bottom:16px;}
        /* Zone 3 — Achievement */
        .zone-achievement{display:flex;flex-direction:column;align-items:center;width:100%;flex:1;justify-content:flex-start;}
        .course-intro{font-family:"Inter",sans-serif;font-size:22px;font-weight:400;color:#aaa;text-align:center;}
        .course-name{font-family:"Inter",sans-serif;font-size:24px;font-weight:700;color:#333;text-align:center;margin-top:4px;}
        /* Footer 3-col */
        .footer{flex-shrink:0;display:flex;align-items:flex-end;justify-content:space-between;padding:14px 80px 38px;border-top:1.5px solid ${c};margin-top:auto;}
        .footer-left{display:flex;flex-direction:column;gap:4px;min-width:180px;}
        .f-org{font-family:"Inter",sans-serif;font-size:18px;font-weight:700;color:#111;}
        .f-sub{font-family:"Inter",sans-serif;font-size:15px;color:#888;}
        .f-date{font-family:"Inter",sans-serif;font-size:15px;color:#aaa;margin-top:2px;}
        .footer-center{display:flex;flex-direction:column;align-items:center;flex:1;max-width:260px;}
        .sig-script{font-family:"Dancing Script",cursive;font-size:34px;color:#333;line-height:1;margin-bottom:6px;}
        .sig-line{width:200px;height:1px;background:#ddd;margin-bottom:6px;}
        .sig-name{font-family:"Inter",sans-serif;font-size:14px;font-weight:600;color:#555;text-align:center;}
        .sig-label{font-family:"Inter",sans-serif;font-size:12px;color:#bbb;letter-spacing:2px;margin-top:2px;}
        .footer-right{display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-end;min-width:80px;}
        .qr-label{font-family:"Inter",sans-serif;font-size:10px;color:#ccc;letter-spacing:1px;text-transform:uppercase;margin-top:4px;text-align:center;}
      </style></head><body><div class="page">
        <div class="header">
          <div class="heyebrow">Official Document</div>
          <div class="htitle">${e(title)}</div>
          <div class="hrule"></div>
        </div>
        <div class="body">
          <div class="zone-recipient">
            <div class="presented">Proudly presented to</div>
            <div class="recipient-name">${e(name)}</div>
            <div class="name-accent"></div>
          </div>
          <div class="zone-achievement">
            ${course ? `<div class="course-intro">For successfully completing</div><div class="course-name">${e(course)}</div>` : ''}
          </div>
        </div>
        <div class="footer">
          <div class="footer-left">${issuer ? `<div class="f-org">${e(issuer)}</div>` : ''}${issuerTitle ? `<div class="f-sub">${e(issuerTitle)}</div>` : ''}<div class="f-date">${e(dateStr)}</div></div>
          <div class="footer-center"><div class="sig-script">${e(issuer || 'Signature')}</div><div class="sig-line"></div>${issuer ? `<div class="sig-name">${e(issuer)}</div>` : ''}<div class="sig-label">Authorized Signature</div></div>
          <div class="footer-right"></div>
        </div>
      </div></body></html>`;
    }

    // ================================================================
    // HERITAGE (formal) — Dark Grand
    // Midnight navy, 140px corner ornaments, centered 4-zone,
    // 3-col footer: medallion | signature | QR+date
    // ================================================================
    const bg = '#0F1729', gold = '#C9A84C', goldL = '#E8CB7A', cream = '#F5ECD7';

    const corner = `<svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" style="width:140px;height:140px;display:block;">
      <line x1="0" y1="1.25" x2="140" y2="1.25" stroke="${gold}" stroke-width="2.5"/>
      <line x1="1.25" y1="0"  x2="1.25" y2="140" stroke="${gold}" stroke-width="2.5"/>
      <line x1="8" y1="8" x2="132" y2="8"  stroke="${gold}" stroke-width="0.8" opacity="0.45"/>
      <line x1="8" y1="8" x2="8"  y2="132" stroke="${gold}" stroke-width="0.8" opacity="0.45"/>
      <rect x="0" y="0" width="34" height="34" fill="${gold}" opacity="0.1"/>
      <rect x="21" y="21" width="14" height="14" fill="${gold}" transform="rotate(45,28,28)"/>
      <line x1="60"  y1="0" x2="60"  y2="8" stroke="${gold}" stroke-width="1" opacity="0.5"/>
      <line x1="100" y1="0" x2="100" y2="8" stroke="${gold}" stroke-width="1" opacity="0.5"/>
      <line x1="0" y1="60"  x2="8"  y2="60"  stroke="${gold}" stroke-width="1" opacity="0.5"/>
      <line x1="0" y1="100" x2="8"  y2="100" stroke="${gold}" stroke-width="1" opacity="0.5"/>
      <circle cx="60"  cy="4" r="2" fill="${gold}" opacity="0.6"/>
      <circle cx="100" cy="4" r="2" fill="${gold}" opacity="0.6"/>
      <circle cx="4" cy="60"  r="2" fill="${gold}" opacity="0.6"/>
      <circle cx="4" cy="100" r="2" fill="${gold}" opacity="0.6"/>
    </svg>`;

    const flourish = `<svg viewBox="0 0 700 32" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:700px;height:32px;display:block;margin:0 auto;">
      <rect x="343" y="11" width="14" height="14" fill="${gold}" transform="rotate(45,350,18)"/>
      <rect x="335" y="14.5" width="7" height="7" fill="${gold}" opacity="0.45" transform="rotate(45,338.5,18)"/>
      <rect x="358" y="14.5" width="7" height="7" fill="${gold}" opacity="0.45" transform="rotate(45,361.5,18)"/>
      <line x1="0"   y1="18" x2="320" y2="18" stroke="${gold}" stroke-width="0.8" opacity="0.55"/>
      <line x1="380" y1="18" x2="700" y2="18" stroke="${gold}" stroke-width="0.8" opacity="0.55"/>
      <path d="M320,18 Q330,18 330,10 Q330,3 341,3" stroke="${gold}" stroke-width="1.2" fill="none"/>
      <path d="M380,18 Q370,18 370,10 Q370,3 359,3" stroke="${gold}" stroke-width="1.2" fill="none"/>
    </svg>`;

    const nameRule = `<svg viewBox="0 0 540 10" xmlns="http://www.w3.org/2000/svg" style="width:540px;max-width:100%;height:10px;display:block;margin:0 auto;">
      <line x1="0"  y1="5" x2="255" y2="5" stroke="${gold}" stroke-width="1.5"/>
      <rect x="263" y="1" width="8" height="8" fill="${gold}" transform="rotate(45,267,5)"/>
      <rect x="255" y="2.5" width="5" height="5" fill="${gold}" opacity="0.5" transform="rotate(45,257.5,5)"/>
      <rect x="277" y="2.5" width="5" height="5" fill="${gold}" opacity="0.5" transform="rotate(45,279.5,5)"/>
      <line x1="282" y1="5" x2="540" y2="5" stroke="${gold}" stroke-width="1.5"/>
    </svg>`;

    const notches = Array.from({length:24},(_,i)=>{const a=(i/24)*Math.PI*2,x1=(55+48*Math.cos(a)).toFixed(1),y1=(55+48*Math.sin(a)).toFixed(1),x2=(55+53*Math.cos(a)).toFixed(1),y2=(55+53*Math.sin(a)).toFixed(1);return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${gold}" stroke-width="2"/>`;}).join('');
    const medal = `<svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg" style="width:110px;height:110px;">
      <circle cx="55" cy="55" r="53" fill="${bg}" stroke="${gold}" stroke-width="2.5"/>
      <circle cx="55" cy="55" r="46" fill="none" stroke="${gold}" stroke-width="0.8"/>
      <circle cx="55" cy="55" r="39" fill="none" stroke="${gold}" stroke-width="0.4" stroke-dasharray="2,3"/>
      ${notches}
      <path d="M20,64 Q13,55 16,44 Q19,34 26,37 Q21,46 24,54 Q26,62 20,64Z" fill="${gold}" opacity="0.7"/>
      <path d="M24,73 Q15,65 18,54 Q21,44 29,47 Q24,56 26,64 Q28,71 24,73Z" fill="${gold}" opacity="0.5"/>
      <path d="M90,64 Q97,55 94,44 Q91,34 84,37 Q89,46 86,54 Q84,62 90,64Z" fill="${gold}" opacity="0.7"/>
      <path d="M86,73 Q95,65 92,54 Q89,44 81,47 Q86,56 84,64 Q82,71 86,73Z" fill="${gold}" opacity="0.5"/>
      <path d="M55,20 L75,27 L75,52 Q75,70 55,80 Q35,70 35,52 L35,27 Z" fill="${gold}" opacity="0.1"/>
      <path d="M55,20 L75,27 L75,52 Q75,70 55,80 Q35,70 35,52 L35,27 Z" fill="none" stroke="${gold}" stroke-width="1.8"/>
      <rect x="45" y="38" width="20" height="14" rx="1" fill="none" stroke="${goldL}" stroke-width="1.3"/>
      <line x1="55" y1="38" x2="55" y2="52" stroke="${goldL}" stroke-width="1"/>
      <circle cx="55" cy="64" r="6" fill="none" stroke="${gold}" stroke-width="1"/>
      <line x1="49" y1="64" x2="61" y2="64" stroke="${gold}" stroke-width="0.7"/>
      <text x="55" y="94" font-family="sans-serif" font-size="5.5" font-weight="bold" fill="${gold}" text-anchor="middle" letter-spacing="1.5">OFFICIAL SEAL</text>
    </svg>`;

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600;1,700&family=Dancing+Script:wght@600;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{width:1100px;height:850px;overflow:hidden;background:${bg};}
      .page{width:1100px;height:850px;position:relative;background:${bg};display:flex;flex-direction:column;}
      /* Corner ornaments */
      .corner{position:absolute;z-index:6;line-height:0;}
      .c-tl{top:0;left:0;} .c-tr{top:0;right:0;transform:scaleX(-1);}
      .c-bl{bottom:0;left:0;transform:scaleY(-1);} .c-br{bottom:0;right:0;transform:scale(-1);}
      /* Border */
      .bh{position:absolute;left:140px;right:140px;height:2.5px;background:${gold};z-index:5;}
      .bv{position:absolute;top:140px;bottom:140px;width:2.5px;background:${gold};z-index:5;}
      .bht{top:1.25px;} .bhb{bottom:1.25px;} .bvl{left:1.25px;} .bvr{right:1.25px;}
      .bhi{position:absolute;left:148px;right:148px;height:0.8px;background:${gold};opacity:0.4;z-index:5;}
      .bvi{position:absolute;top:148px;bottom:148px;width:0.8px;background:${gold};opacity:0.4;z-index:5;}
      .bhit{top:8px;} .bhib{bottom:8px;} .bvil{left:8px;} .bvir{right:8px;}
      /* Content inside corners + padding */
      .content{position:absolute;top:52px;bottom:0;left:60px;right:60px;display:flex;flex-direction:column;align-items:center;z-index:2;}
      /* Zone 1 — Header */
      .zone-header{width:100%;display:flex;flex-direction:column;align-items:center;padding-bottom:12px;}
      .cert-title{font-family:"Cinzel",serif;font-size:30px;font-weight:700;color:${gold};letter-spacing:8px;text-transform:uppercase;text-align:center;margin-bottom:16px;}
      /* Zone 2 — Recipient */
      .zone-recipient{flex:1;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 0;}
      .presented{font-family:"EB Garamond",serif;font-style:italic;font-size:20px;color:rgba(245,236,215,0.6);text-align:center;margin-bottom:10px;}
      .recipient-name{font-family:"Cormorant Garamond",serif;font-size:78px;font-weight:700;font-style:italic;color:${gold};text-align:center;line-height:1;letter-spacing:1px;margin-bottom:10px;text-shadow:0 0 50px rgba(201,168,76,0.3);}
      /* Zone 3 — Achievement */
      .zone-achievement{width:100%;display:flex;flex-direction:column;align-items:center;padding:6px 0 16px;}
      .recog-text{font-family:"EB Garamond",serif;font-style:italic;font-size:18px;color:rgba(245,236,215,0.6);text-align:center;line-height:1.5;margin-bottom:7px;}
      .course-name{font-family:"Cinzel",serif;font-size:26px;font-weight:700;color:${goldL};letter-spacing:4px;text-transform:uppercase;text-align:center;}
      /* Footer 3-col */
      .footer{position:absolute;bottom:0;left:60px;right:60px;display:flex;align-items:flex-end;justify-content:space-between;padding-bottom:38px;z-index:2;}
      .footer-left{flex-shrink:0;}
      .footer-center{flex:1;display:flex;flex-direction:column;align-items:center;padding:0 30px;}
      .sig-script{font-family:"Dancing Script",cursive;font-size:34px;color:${cream};line-height:1;margin-bottom:6px;}
      .sig-line-g{width:220px;height:1px;background:linear-gradient(90deg,transparent,${gold} 25%,${gold} 75%,transparent);margin-bottom:7px;}
      .sig-name{font-family:"Cinzel",serif;font-size:15px;font-weight:600;color:${gold};letter-spacing:2px;text-align:center;}
      .sig-title{font-family:"EB Garamond",serif;font-style:italic;font-size:13px;color:rgba(245,236,215,0.5);text-align:center;margin-top:2px;}
      .sig-date{font-family:"EB Garamond",serif;font-size:16px;color:${gold};opacity:0.65;margin-top:8px;text-align:center;}
      .footer-right{flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:4px;}
    </style></head><body><div class="page">
      <div class="bh bht"></div><div class="bh bhb"></div>
      <div class="bv bvl"></div><div class="bv bvr"></div>
      <div class="bhi bhit"></div><div class="bhi bhib"></div>
      <div class="bvi bvil"></div><div class="bvi bvir"></div>
      <div class="corner c-tl">${corner}</div><div class="corner c-tr">${corner}</div>
      <div class="corner c-bl">${corner}</div><div class="corner c-br">${corner}</div>
      <div class="content">
        <div class="zone-header">
          <div class="cert-title">${e(title)}</div>
          ${flourish}
        </div>
        <div class="zone-recipient">
          <div class="presented">Presented to</div>
          <div class="recipient-name">${e(name)}</div>
          ${nameRule}
        </div>
        <div class="zone-achievement">
          ${course ? `<div class="recog-text">In recognition of outstanding completion of</div><div class="course-name">${e(course)}</div>` : ''}
        </div>
      </div>
      <div class="footer">
        <div class="footer-left">${medal}</div>
        <div class="footer-center">
          <div class="sig-script">${e(issuer || 'Signature')}</div>
          <div class="sig-line-g"></div>
          ${issuer ? `<div class="sig-name">${e(issuer)}</div>` : ''}
          ${issuerTitle ? `<div class="sig-title">${e(issuerTitle)}</div>` : ''}
          <div class="sig-date">${e(dateStr)}</div>
        </div>
        <div class="footer-right"></div>
      </div>
    </div></body></html>`;
  }
