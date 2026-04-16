  // -- Build preview HTML (mirrors Chromium templates exactly) --
  function buildPreviewHtml({ name, title, course, dateStr, issuer, issuerTitle, color, template }) {
    const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

    // ============================================================
    // ELEGANT
    // ============================================================
    if (template === 'elegant') {
      const navy = '#1B365D';
      const gold = '#C5A55A';
      const words = title.split(' ');
      const mid = Math.ceil(words.length / 2);
      const line1 = words.slice(0, mid).join(' ').toUpperCase();
      const line2 = words.slice(mid).join(' ').toUpperCase();
      const C = (transform) => `<svg viewBox="0 0 120 120" style="width:120px;height:120px;" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="22" height="22" fill="${navy}"/>
        <line x1="22" y1="4" x2="116" y2="4" stroke="${gold}" stroke-width="2.5"/>
        <line x1="22" y1="11" x2="116" y2="11" stroke="${navy}" stroke-width="7"/>
        <line x1="4" y1="22" x2="4" y2="116" stroke="${gold}" stroke-width="2.5"/>
        <line x1="11" y1="22" x2="11" y2="116" stroke="${navy}" stroke-width="7"/>
        <path d="M22,22 Q30,22 30,30 Q30,38 38,38" stroke="${gold}" stroke-width="1.5" fill="none"/>
        <circle cx="38" cy="38" r="3" fill="${gold}" opacity="0.7"/>
        <path d="M56,4 L56,0 M56,0 L52,4 M56,0 L60,4" stroke="${gold}" stroke-width="1.2" fill="none"/>
        <path d="M4,56 L0,56 M0,56 L4,52 M0,56 L4,60" stroke="${gold}" stroke-width="1.2" fill="none"/>
      </svg>`;
      const seal = `<svg viewBox="0 0 80 80" style="width:68px;height:68px;" xmlns="http://www.w3.org/2000/svg">
        <path d="M40,4 L68,14 L68,42 Q68,62 40,76 Q12,62 12,42 L12,14 Z" fill="none" stroke="${gold}" stroke-width="2"/>
        <rect x="30" y="30" width="20" height="14" rx="1" fill="none" stroke="${navy}" stroke-width="1.5"/>
        <line x1="40" y1="30" x2="40" y2="44" stroke="${navy}" stroke-width="1.2"/>
        <line x1="33" y1="34" x2="38" y2="34" stroke="${navy}" stroke-width="0.8"/>
        <line x1="42" y1="34" x2="47" y2="34" stroke="${navy}" stroke-width="0.8"/>
        <circle cx="40" cy="60" r="2" fill="${gold}"/>
      </svg>`;
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Dancing+Script:wght@600&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}html,body{width:1100px;height:850px;overflow:hidden;background:#FDFAF3;}
.page{width:1100px;height:850px;position:relative;background:#FDFAF3;display:flex;flex-direction:column;align-items:center;overflow:hidden;}
.corner{position:absolute;}.c-tl{top:0;left:0;}.c-tr{top:0;right:0;transform:scaleX(-1);}.c-bl{bottom:0;left:0;transform:scaleY(-1);}.c-br{bottom:0;right:0;transform:scale(-1);}
.b-top{position:absolute;top:11px;left:112px;right:112px;height:7px;background:${navy};}
.b-top::before{content:"";position:absolute;top:-4px;left:0;right:0;height:2.5px;background:${gold};}
.b-bottom{position:absolute;bottom:11px;left:112px;right:112px;height:7px;background:${navy};}
.b-bottom::before{content:"";position:absolute;bottom:-4px;left:0;right:0;height:2.5px;background:${gold};}
.b-left{position:absolute;left:11px;top:112px;bottom:112px;width:7px;background:${navy};}
.b-left::before{content:"";position:absolute;left:-4px;top:0;bottom:0;width:2.5px;background:${gold};}
.b-right{position:absolute;right:11px;top:112px;bottom:112px;width:7px;background:${navy};}
.b-right::before{content:"";position:absolute;right:-4px;top:0;bottom:0;width:2.5px;background:${gold};}
.inner-border{position:absolute;top:24px;left:24px;right:24px;bottom:24px;border:1px solid ${gold};pointer-events:none;}
.content{position:relative;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;flex:1;padding:0 130px 0;}
.t1{font-family:'Cinzel',serif;font-size:52px;font-weight:700;color:${navy};letter-spacing:6px;text-align:center;line-height:1;}
.t2{font-family:'Cinzel',serif;font-size:38px;font-weight:600;color:${navy};letter-spacing:4px;text-align:center;line-height:1;margin-bottom:10px;}
.presented{font-family:'EB Garamond',serif;font-style:italic;font-size:16px;color:#666;margin-bottom:5px;}
.recname{font-family:'Cormorant Garamond',serif;font-size:72px;font-weight:700;color:${navy};text-align:center;line-height:1;letter-spacing:2px;margin-bottom:4px;}
.nrule{width:480px;height:1.5px;background:linear-gradient(90deg,transparent,${gold} 20%,${gold} 80%,transparent);margin:6px auto 12px;}
.ct{font-family:'Cinzel',serif;font-size:13px;font-weight:600;color:#444;letter-spacing:3px;text-align:center;margin-bottom:4px;}
.cn{font-family:'Cinzel',serif;font-size:15px;font-weight:700;color:#222;letter-spacing:3px;text-align:center;margin-bottom:8px;}
.ddate{font-family:'EB Garamond',serif;font-size:14px;color:#888;text-align:center;margin-bottom:6px;}
.iissuer{font-family:'Cinzel',serif;font-size:16px;font-weight:700;color:${navy};letter-spacing:4px;text-align:center;}
.footer{position:relative;z-index:5;display:flex;align-items:flex-end;justify-content:space-between;width:100%;padding:0 100px 28px;}
.sig{display:flex;flex-direction:column;}.siglabel{font-family:'EB Garamond',serif;font-size:10px;color:#888;margin-bottom:3px;}
.sigscript{font-family:'Dancing Script',cursive;font-size:22px;color:#333;line-height:1;margin-bottom:3px;}
.sigline{width:150px;height:1px;background:#aaa;margin-bottom:5px;}.signame{font-family:'EB Garamond',serif;font-size:11px;color:#555;}
</style></head><body><div class="page">
<div class="b-top"></div><div class="b-bottom"></div><div class="b-left"></div><div class="b-right"></div>
<div class="inner-border"></div>
<div class="corner c-tl">${C()}</div><div class="corner c-tr">${C()}</div>
<div class="corner c-bl">${C()}</div><div class="corner c-br">${C()}</div>
<div class="content">
  <div class="t1">${esc(line1)}</div>${line2 ? `<div class="t2">${esc(line2)}</div>` : ''}
  <div class="presented">This is proudly presented to</div>
  <div class="recname">${esc(name)}</div><div class="nrule"></div>
  ${course ? `<div class="ct">FOR SUCCESSFULLY COMPLETING</div><div class="cn">${esc(course.toUpperCase())}</div>` : ''}
  <div class="ddate">Date: ${esc(dateStr)}</div>
  ${issuer ? `<div class="iissuer">${esc(issuer.toUpperCase())}</div>` : ''}
</div>
<div class="footer">
  <div class="sig">
    <div class="siglabel">Authorized Signature:</div>
    <div class="sigscript">${esc(issuer || 'Signature')}</div>
    <div class="sigline"></div>
    ${issuerTitle ? `<div class="signame">${esc(issuerTitle)}${issuer ? ', ' + esc(issuer) : ''}</div>` : ''}
  </div>
  <div>${seal}</div>
  <div></div>
</div>
</div></body></html>`;
    }

    // ============================================================
    // MODERN
    // ============================================================
    if (template === 'modern') {
      const c = color || '#4F46E5';
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Dancing+Script:wght@600&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}html,body{width:1100px;height:850px;overflow:hidden;background:#fff;}
.page{width:1100px;height:850px;background:#fff;display:flex;flex-direction:column;overflow:hidden;}
.topbar{height:18px;background:${c};flex-shrink:0;}
.content{flex:1;display:flex;flex-direction:column;justify-content:flex-start;padding:60px 75px 20px;}
.mtype{font-family:'Inter',sans-serif;font-size:15px;font-weight:700;color:${c};letter-spacing:5px;text-transform:uppercase;margin-bottom:18px;}
.mname{font-family:'Inter',sans-serif;font-size:82px;font-weight:900;color:#111;line-height:1;letter-spacing:-2px;margin-bottom:18px;}
.mcl1{font-family:'Inter',sans-serif;font-size:24px;font-weight:600;color:#777;line-height:1.4;}
.mcl2{font-family:'Inter',sans-serif;font-size:24px;font-weight:600;color:#777;line-height:1.4;}
.bottom{padding:0 75px 50px;}
.metarow{display:flex;align-items:flex-end;gap:50px;margin-bottom:22px;}
.dateval{font-family:'Inter',sans-serif;font-size:16px;color:#111;}
.issuval{font-family:'Inter',sans-serif;font-size:16px;font-weight:700;color:#111;}
.siggrp{display:flex;align-items:flex-end;gap:12px;}
.sigscript{font-family:'Dancing Script',cursive;font-size:28px;color:#333;line-height:1;margin-bottom:-4px;}
.sigline{width:200px;height:1px;background:#ccc;margin-bottom:8px;}
</style></head><body><div class="page">
<div class="topbar"></div>
<div class="content">
  <div class="mtype">${esc(title)}</div>
  <div class="mname">${esc(name)}</div>
  ${course ? `<div class="mcl1">For successfully completing</div><div class="mcl2">${esc(course)}</div>` : ''}
</div>
<div class="bottom">
  <div class="metarow">
    <div>
      <div class="dateval">${esc(dateStr)}</div>
      ${issuer ? `<div class="issuval">${esc(issuer)}</div>` : ''}
    </div>
    <div class="siggrp">
      <div class="sigscript">${esc(issuerTitle || issuer || 'Signature')}</div>
      <div class="sigline"></div>
    </div>
  </div>
</div>
</div></body></html>`;
    }

    // ============================================================
    // FORMAL
    // ============================================================
    const fc = color || '#6B1D2A';
    const fg = '#B8962E';
    const fCorner = `<svg viewBox="0 0 90 90" style="width:90px;height:90px;" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="0" x2="90" y2="0" stroke="${fc}" stroke-width="3.5"/>
      <line x1="0" y1="0" x2="0" y2="90" stroke="${fc}" stroke-width="3.5"/>
      <line x1="4" y1="4" x2="88" y2="4" stroke="${fc}" stroke-width="1"/>
      <line x1="4" y1="4" x2="4" y2="88" stroke="${fc}" stroke-width="1"/>
      <path d="M10,10 Q20,8 22,18 Q24,28 14,28 Q4,28 6,18 Q8,10 14,12" fill="${fc}" opacity="0.85"/>
      <line x1="14" y1="28" x2="14" y2="40" stroke="${fc}" stroke-width="1.5"/>
      <path d="M14,40 Q10,36 12,32" stroke="${fc}" stroke-width="1" fill="none"/>
      <path d="M14,40 Q18,36 16,32" stroke="${fc}" stroke-width="1" fill="none"/>
      <line x1="28" y1="14" x2="40" y2="14" stroke="${fc}" stroke-width="1.5"/>
      <path d="M40,14 Q36,10 32,12" stroke="${fc}" stroke-width="1" fill="none"/>
      <path d="M40,14 Q36,18 32,16" stroke="${fc}" stroke-width="1" fill="none"/>
    </svg>`;
    const flourish = `<svg viewBox="0 0 600 28" style="width:600px;height:28px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
      <rect x="295" y="9" width="10" height="10" fill="${fc}" transform="rotate(45,300,14)"/>
      <line x1="0" y1="14" x2="276" y2="14" stroke="${fc}" stroke-width="1"/>
      <path d="M276,14 Q284,14 284,8 Q284,2 290,2 Q296,2 296,8" stroke="${fc}" stroke-width="1.2" fill="none"/>
      <line x1="600" y1="14" x2="324" y2="14" stroke="${fc}" stroke-width="1"/>
      <path d="M324,14 Q316,14 316,8 Q316,2 310,2 Q304,2 304,8" stroke="${fc}" stroke-width="1.2" fill="none"/>
      <path d="M230,14 Q222,14 222,8 Q222,4 228,4" stroke="${fc}" stroke-width="0.8" fill="none" opacity="0.7"/>
      <path d="M370,14 Q378,14 378,8 Q378,4 372,4" stroke="${fc}" stroke-width="0.8" fill="none" opacity="0.7"/>
    </svg>`;
    const notches = Array.from({length:16},(_,i)=>{
      const a=(i/16)*Math.PI*2;
      const x1=(55+48*Math.cos(a)).toFixed(1), y1=(55+48*Math.sin(a)).toFixed(1);
      const x2=(55+52*Math.cos(a)).toFixed(1), y2=(55+52*Math.sin(a)).toFixed(1);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${fc}" stroke-width="2"/>`;
    }).join('');
    const medal = `<svg viewBox="0 0 110 110" style="width:110px;height:110px;" xmlns="http://www.w3.org/2000/svg">
      <circle cx="55" cy="55" r="52" fill="${fc}" opacity="0.08"/>
      <circle cx="55" cy="55" r="52" fill="none" stroke="${fc}" stroke-width="3"/>
      <circle cx="55" cy="55" r="44" fill="none" stroke="${fc}" stroke-width="1.5"/>
      <circle cx="55" cy="55" r="36" fill="none" stroke="${fc}" stroke-width="0.8"/>
      ${notches}
      <path d="M55,22 L74,28 L74,50 Q74,68 55,78 Q36,68 36,50 L36,28 Z" fill="none" stroke="${fc}" stroke-width="1.5"/>
      <rect x="46" y="38" width="18" height="12" rx="1" fill="none" stroke="${fc}" stroke-width="1.2"/>
      <line x1="55" y1="38" x2="55" y2="50" stroke="${fc}" stroke-width="1"/>
      <text x="55" y="92" font-family="sans-serif" font-size="5" fill="${fc}" text-anchor="middle" font-weight="bold">ACADEMY OF EXCELLENCE</text>
    </svg>`;
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600;1,700&family=Dancing+Script:wght@500;600&family=IM+Fell+English:ital@0;1&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}html,body{width:1100px;height:850px;overflow:hidden;background:#F5EDD8;}
.page{width:1100px;height:850px;position:relative;background:#F5EDD8;display:flex;flex-direction:column;overflow:hidden;}
.corner{position:absolute;z-index:10;}.c-tl{top:0;left:0;}.c-tr{top:0;right:0;transform:scaleX(-1);}.c-bl{bottom:0;left:0;transform:scaleY(-1);}.c-br{bottom:0;right:0;transform:scale(-1);}
.bt{position:absolute;top:0;left:90px;right:90px;height:3.5px;background:${fc};z-index:5;}
.bb{position:absolute;bottom:0;left:90px;right:90px;height:3.5px;background:${fc};z-index:5;}
.bl{position:absolute;left:0;top:90px;bottom:90px;width:3.5px;background:${fc};z-index:5;}
.br{position:absolute;right:0;top:90px;bottom:90px;width:3.5px;background:${fc};z-index:5;}
.bti{position:absolute;top:4px;left:94px;right:94px;height:1px;background:${fc};z-index:5;}
.bbi{position:absolute;bottom:4px;left:94px;right:94px;height:1px;background:${fc};z-index:5;}
.bli{position:absolute;left:4px;top:94px;bottom:94px;width:1px;background:${fc};z-index:5;}
.bri{position:absolute;right:4px;top:94px;bottom:94px;width:1px;background:${fc};z-index:5;}
.content{position:relative;z-index:5;display:flex;flex-direction:column;align-items:center;padding:60px 100px 0;flex:1;}
.fctitle{font-family:'Cinzel',serif;font-size:30px;font-weight:700;color:${fc};letter-spacing:3px;text-align:center;margin-bottom:10px;}
.fptitle{font-family:'IM Fell English',serif;font-style:italic;font-size:15px;color:#666;text-align:center;margin-bottom:6px;}
.fname{font-family:'Cormorant Garamond',serif;font-size:70px;font-weight:700;font-style:italic;color:#1a1a1a;text-align:center;line-height:1;margin-bottom:6px;}
.fnrule{width:400px;height:1px;background:linear-gradient(90deg,transparent,#bbb 20%,#bbb 80%,transparent);margin:0 auto 14px;}
.frecog{font-family:'IM Fell English',serif;font-size:14px;color:#555;text-align:center;line-height:1.5;margin-bottom:6px;}
.fcname{font-family:'Cinzel',serif;font-size:22px;font-weight:700;color:${fc};letter-spacing:3px;text-align:center;text-transform:uppercase;}
.footer{position:relative;z-index:5;display:flex;align-items:flex-end;justify-content:space-between;padding:12px 85px 45px;}
.fsigblock{display:flex;flex-direction:column;align-items:center;flex:1;}
.fsigscript{font-family:'Dancing Script',cursive;font-size:26px;color:#333;line-height:1;margin-bottom:2px;}
.fsigline{width:200px;height:1px;background:#aaa;margin-bottom:7px;}
.fsigname{font-family:'Cinzel',serif;font-size:11px;font-weight:600;color:#333;letter-spacing:1px;}
.fsigtitle{font-family:'IM Fell English',serif;font-size:10px;color:#888;font-style:italic;}
.fdaterow{font-family:'IM Fell English',serif;font-size:14px;color:#888;text-align:center;margin-top:6px;}
</style></head><body><div class="page">
<div class="bt"></div><div class="bb"></div><div class="bl"></div><div class="br"></div>
<div class="bti"></div><div class="bbi"></div><div class="bli"></div><div class="bri"></div>
<div class="corner c-tl">${fCorner}</div><div class="corner c-tr">${fCorner}</div>
<div class="corner c-bl">${fCorner}</div><div class="corner c-br">${fCorner}</div>
<div class="content">
  <div class="fctitle">${esc(title)}</div>
  ${flourish}
  <div class="fptitle">Presented to</div>
  <div class="fname">${esc(name)}</div>
  <div class="fnrule"></div>
  ${course ? `<div class="frecog">In recognition of successfully completing<br>all requirements for the course</div><div class="fcname">${esc(course)}</div>` : ''}
</div>
<div class="footer">
  <div style="flex-shrink:0;">${medal}</div>
  <div class="fsigblock">
    <div class="fsigscript">${esc(issuer || 'Signature')}</div>
    <div class="fsigline"></div>
    ${issuerTitle ? `<div class="fsigname">${esc(issuerTitle)}</div>` : ''}
    ${issuer ? `<div class="fsigtitle">${esc(issuer)}</div>` : ''}
    <div class="fdaterow">${esc(dateStr)}</div>
  </div>
  <div style="flex-shrink:0;width:70px;"></div>
</div>
</div></body></html>`;
  }
