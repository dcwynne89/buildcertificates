/* ============================================================
   certificate-app.js — Consumer site logic
   Form state, live preview, PDF generation, CSV bulk upload
   ============================================================ */

(function () {
  "use strict";

  const API_BASE = "/api/v1";
  let apiKey = localStorage.getItem("bcrt_api_key");

  // ── Auto-register guest key ──
  async function ensureApiKey() {
    if (apiKey) return apiKey;
    try {
      const guestEmail = `guest_${Date.now()}@buildcertificates.com`;
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: guestEmail }),
      });
      const data = await res.json();
      if (data.success && data.api_key) {
        apiKey = data.api_key;
        localStorage.setItem("bcrt_api_key", apiKey);
        return apiKey;
      }
    } catch (e) {
      console.error("Auto-register failed:", e);
    }
    return null;
  }

  // ── Toast ──
  function showToast(msg, type = "success") {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.className = `toast ${type} show`;
    setTimeout(() => (t.className = "toast"), 3500);
  }

  // ── Tab Switching ──
  window.switchTab = function (mode) {
    const singlePanel = document.getElementById("singlePanel");
    const bulkPanel = document.getElementById("bulkPanel");
    const tabSingle = document.getElementById("tabSingle");
    const tabBulk = document.getElementById("tabBulk");

    if (mode === "single") {
      singlePanel.className = "single-panel active";
      bulkPanel.className = "bulk-panel";
      tabSingle.classList.add("active");
      tabBulk.classList.remove("active");
    } else {
      singlePanel.className = "single-panel";
      singlePanel.style.display = "none";
      bulkPanel.className = "bulk-panel active";
      tabSingle.classList.remove("active");
      tabBulk.classList.add("active");
    }
  };

  // ── Live Preview — iframe renderer (matches Chromium output exactly) ──
  let previewDebounce = null;

  function updatePreview() {
    clearTimeout(previewDebounce);
    previewDebounce = setTimeout(_renderPreview, 120);
  }

  function _renderPreview() {
    const name        = document.getElementById("recipientName").value || "Recipient Name";
    const title       = document.getElementById("certTitle").value     || "Certificate of Completion";
    const course      = document.getElementById("courseName").value    || "";
    const dateRaw     = document.getElementById("certDate").value;
    const dateStr     = dateRaw
      ? new Date(dateRaw + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const issuer      = document.getElementById("issuerName").value    || "";
    const issuerTitle = document.getElementById("issuerTitle").value   || "";
    const color       = document.getElementById("accentColor").value;
    const template    = document.getElementById("templateSelect").value;

    const html = buildPreviewHtml({ name, title, course, dateStr, issuer, issuerTitle, color, template });

    // Certificate native dimensions (matching template HTML)
    const CERT_W = 1100, CERT_H = 850;
    const previewBody = document.getElementById("previewBody");

    // Build DOM once
    let wrapper = document.getElementById("previewWrapper");
    let iframe  = document.getElementById("previewIframe");

    if (!wrapper) {
      previewBody.innerHTML = "";

      wrapper = document.createElement("div");
      wrapper.id = "previewWrapper";
      // CSS handles box-shadow & border-radius via #previewWrapper rule
      wrapper.style.cssText = "position:relative;overflow:hidden;flex-shrink:0;";
      previewBody.appendChild(wrapper);

      iframe = document.createElement("iframe");
      iframe.id = "previewIframe";
      iframe.style.cssText = `position:absolute;top:0;left:0;width:${CERT_W}px;height:${CERT_H}px;border:none;display:block;`;
      iframe.setAttribute("sandbox", "allow-same-origin");
      wrapper.appendChild(iframe);

      // Re-scale whenever the panel resizes (e.g. window resize)
      if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => _applyScale(CERT_W, CERT_H));
        ro.observe(previewBody);
      }
    }

    _applyScale(CERT_W, CERT_H);
    iframe.srcdoc = html;
  }

  function _applyScale(certW, certH) {
    const wrapper = document.getElementById("previewWrapper");
    const previewBody = document.getElementById("previewBody");
    const iframe  = document.getElementById("previewIframe");
    if (!wrapper || !iframe) return;

    // Available space: panel width/height minus 32px padding budget (16px each side)
    const PAD = 32;
    const availW = (previewBody.offsetWidth  || 500) - PAD;
    const availH = (previewBody.offsetHeight || 460) - PAD;

    // Scale to fit both dimensions, preserving aspect ratio
    const scaleW = availW / certW;
    const scaleH = availH / certH;
    const scale  = Math.min(scaleW, scaleH, 1); // never upscale beyond 100%

    const dispW = Math.round(certW * scale);
    const dispH = Math.round(certH * scale);

    wrapper.style.width  = dispW + "px";
    wrapper.style.height = dispH + "px";
    iframe.style.transform       = `scale(${scale})`;
    iframe.style.transformOrigin = "top left";
  }


  // -- Build preview HTML (mirrors Chromium templates exactly) --
  function buildPreviewHtml({ name, title, course, dateStr, issuer, issuerTitle, color, template }) {
    const e = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    // =================================================================
    // PRESTIGE (elegant)
    // =================================================================
    if (template === 'elegant') {
      const navy = '#1B365D', gold = '#C9A84C', cream = '#F9F6EE';
      const sealSvg = `<svg viewBox="0 0 90 90" style="width:90px;height:90px;" xmlns="http://www.w3.org/2000/svg">
        <circle cx="45" cy="45" r="43" fill="none" stroke="${gold}" stroke-width="2"/>
        <circle cx="45" cy="45" r="36" fill="none" stroke="${gold}" stroke-width="0.8" stroke-dasharray="3,3"/>
        <path d="M18,55 Q12,48 15,40 Q18,33 23,36 Q18,42 20,48 Q22,54 18,55Z" fill="${gold}" opacity="0.8"/>
        <path d="M22,62 Q14,56 16,47 Q18,39 24,41 Q20,47 21,54 Q23,60 22,62Z" fill="${gold}" opacity="0.65"/>
        <path d="M72,55 Q78,48 75,40 Q72,33 67,36 Q72,42 70,48 Q68,54 72,55Z" fill="${gold}" opacity="0.8"/>
        <path d="M68,62 Q76,56 74,47 Q72,39 66,41 Q70,47 69,54 Q67,60 68,62Z" fill="${gold}" opacity="0.65"/>
        <path d="M45,18 L60,24 L60,44 Q60,60 45,68 Q30,60 30,44 L30,24 Z" fill="${navy}" opacity="0.9"/>
        <path d="M45,22 L56,27 L56,44 Q56,57 45,64 Q34,57 34,44 L34,27 Z" fill="none" stroke="${gold}" stroke-width="1" opacity="0.6"/>
        <rect x="38" y="34" width="14" height="10" rx="0.5" fill="none" stroke="${gold}" stroke-width="1.2"/>
        <line x1="45" y1="34" x2="45" y2="44" stroke="${gold}" stroke-width="1"/>
        <line x1="40" y1="37.5" x2="44" y2="37.5" stroke="${gold}" stroke-width="0.7"/>
        <line x1="40" y1="40" x2="44" y2="40" stroke="${gold}" stroke-width="0.7"/>
        <line x1="46" y1="37.5" x2="50" y2="37.5" stroke="${gold}" stroke-width="0.7"/>
        <line x1="46" y1="40" x2="50" y2="40" stroke="${gold}" stroke-width="0.7"/>
        <circle cx="45" cy="60" r="2" fill="${gold}"/>
      </svg>`;
      const panelOrn = `<svg viewBox="0 0 60 200" style="width:60px;height:200px;" xmlns="http://www.w3.org/2000/svg">
        <line x1="30" y1="0" x2="30" y2="200" stroke="${gold}" stroke-width="0.5" stroke-opacity="0.4"/>
        <circle cx="30" cy="30" r="4" fill="${gold}" opacity="0.6"/>
        <circle cx="30" cy="30" r="7" fill="none" stroke="${gold}" stroke-width="0.8" opacity="0.4"/>
        <path d="M30,40 Q22,55 30,70 Q38,55 30,40Z" fill="${gold}" opacity="0.4"/>
        <path d="M30,80 L26,90 L30,100 L34,90 Z" fill="${gold}" opacity="0.3"/>
        <circle cx="30" cy="115" r="4" fill="${gold}" opacity="0.5"/>
        <path d="M30,125 Q22,140 30,155 Q38,140 30,125Z" fill="${gold}" opacity="0.3"/>
        <circle cx="30" cy="170" r="4" fill="${gold}" opacity="0.6"/>
      </svg>`;
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Cinzel:wght@400;600;700&family=Dancing+Script:wght@600;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html,body{width:1100px;height:850px;overflow:hidden;background:${cream};}
        .page{width:1100px;height:850px;position:relative;background:${cream};display:flex;overflow:hidden;}
        .left{width:140px;background:${navy};flex-shrink:0;position:relative;display:flex;align-items:center;justify-content:center;}
        .left::after{content:"";position:absolute;right:-1px;top:8%;bottom:8%;width:2px;background:linear-gradient(180deg,transparent,${gold} 15%,${gold} 85%,transparent);}
        .main{flex:1;display:flex;flex-direction:column;padding:52px 60px 22px 50px;}
        .top-rule{display:flex;align-items:center;gap:10px;margin-bottom:22px;}
        .trl{flex:1;height:1px;background:linear-gradient(90deg,${gold},transparent);}
        .trd{width:8px;height:8px;background:${gold};transform:rotate(45deg);flex-shrink:0;}
        /* FONT SIZES: print-correct for 1100x850 canvas */
        .ctitle{font-family:"Cinzel",serif;font-size:22px;font-weight:600;color:${navy};letter-spacing:6px;text-transform:uppercase;margin-bottom:12px;}
        .presented{font-family:"EB Garamond",serif;font-style:italic;font-size:20px;color:#888;margin-bottom:4px;}
        .rname{font-family:"Playfair Display",serif;font-size:78px;font-weight:800;color:${navy};line-height:0.95;letter-spacing:-1px;margin-bottom:10px;}
        .nrule{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
        .nrl{flex:1;height:1.5px;background:linear-gradient(90deg,${gold},rgba(201,168,76,0.2));}
        .nrd{width:8px;height:8px;background:${gold};transform:rotate(45deg);flex-shrink:0;}
        .nrds{width:5px;height:5px;background:${gold};transform:rotate(45deg);flex-shrink:0;opacity:0.6;}
        .cintro{font-family:"EB Garamond",serif;font-style:italic;font-size:18px;color:#999;margin-bottom:4px;}
        .cname{font-family:"Cinzel",serif;font-size:22px;font-weight:600;color:${navy};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px;}
        .mdate{font-family:"EB Garamond",serif;font-size:16px;color:#aaa;}
        .missuer{font-family:"Cinzel",serif;font-size:16px;font-weight:600;color:${navy};letter-spacing:2px;}
        .footer{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;}
        .sig{display:flex;flex-direction:column;}
        .siglabel{font-family:"EB Garamond",serif;font-size:13px;color:#bbb;letter-spacing:2px;text-transform:uppercase;margin-bottom:3px;}
        .sigscript{font-family:"Dancing Script",cursive;font-size:32px;color:#444;line-height:1;margin-bottom:5px;}
        .sigline{width:200px;height:1px;background:#ccc;margin-bottom:5px;}
        .signame{font-family:"EB Garamond",serif;font-size:15px;color:#888;}
      </style></head><body><div class="page">
        <div class="left">${panelOrn}</div>
        <div class="main">
          <div class="top-rule"><div class="trl"></div><div class="trd"></div></div>
          <div class="ctitle">${e(title)}</div>
          <div class="presented">This is proudly presented to</div>
          <div class="rname">${e(name)}</div>
          <div class="nrule"><div class="nrl"></div><div class="nrds"></div><div class="nrd"></div><div class="nrds"></div></div>
          ${course ? `<div class="cintro">For successfully completing</div><div class="cname">${e(course)}</div>` : ''}
          <div class="mdate">${e(dateStr)}</div>
          ${issuer ? `<div class="missuer">${e(issuer)}</div>` : ''}
          <div class="footer">
            <div class="sig">
              <div class="siglabel">Authorized Signature</div>
              <div class="sigscript">${e(issuer || 'Signature')}</div>
              <div class="sigline"></div>
              ${issuerTitle ? `<div class="signame">${e(issuerTitle)}</div>` : ''}
            </div>
            <div>${sealSvg}</div>
            <div></div>
          </div>
        </div>
      </div></body></html>`;
    }

    // =================================================================
    // EXECUTIVE (modern)
    // =================================================================
    if (template === 'modern') {
      const c = color || '#3730A3';
      const cB = '#7C3AED';
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Dancing+Script:wght@600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html,body{width:1100px;height:850px;overflow:hidden;background:#fff;}
        .page{width:1100px;height:850px;background:#fff;display:flex;flex-direction:column;overflow:hidden;}
        .header{flex-shrink:0;height:200px;background:linear-gradient(135deg,${c} 0%,${cB} 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 70px;position:relative;}
        .header::after{content:"";position:absolute;bottom:0;left:0;right:0;height:4px;background:rgba(255,255,255,0.15);}
        /* FONT SIZES: print-correct */
        .heyebrow{font-family:"Inter",sans-serif;font-size:14px;font-weight:500;color:rgba(255,255,255,0.6);letter-spacing:6px;text-transform:uppercase;margin-bottom:8px;}
        .htitle{font-family:"Inter",sans-serif;font-size:42px;font-weight:800;color:#fff;letter-spacing:5px;text-transform:uppercase;text-align:center;line-height:1;margin-bottom:14px;}
        .hrule{width:260px;height:1px;background:rgba(255,255,255,0.35);}
        .body{flex:1;display:flex;flex-direction:column;padding:42px 70px 28px;}
        .presented{font-family:"Inter",sans-serif;font-size:16px;font-weight:400;color:#aaa;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;}
        .rname{font-family:"Inter",sans-serif;font-size:85px;font-weight:900;color:#0f0f0f;line-height:0.95;letter-spacing:-3px;margin-bottom:18px;}
        .divider{width:60px;height:4px;background:${c};border-radius:2px;margin-bottom:14px;}
        .cintro{font-family:"Inter",sans-serif;font-size:24px;font-weight:400;color:#888;line-height:1.4;}
        .cname{font-family:"Inter",sans-serif;font-size:24px;font-weight:700;color:#444;line-height:1.4;}
        .bottom{display:flex;align-items:flex-end;justify-content:space-between;padding-top:18px;border-top:1px solid #f0f0f0;margin-top:auto;}
        .mdate{font-family:"Inter",sans-serif;font-size:18px;color:#999;}
        .missuer{font-family:"Inter",sans-serif;font-size:20px;font-weight:700;color:#222;}
        .sigblock{display:flex;flex-direction:column;align-items:center;}
        .sigscript{font-family:"Dancing Script",cursive;font-size:34px;color:#333;line-height:1;margin-bottom:4px;}
        .sigline{width:200px;height:1px;background:#ddd;margin-bottom:5px;}
        .siglabel{font-family:"Inter",sans-serif;font-size:13px;color:#bbb;letter-spacing:2px;}
      </style></head><body><div class="page">
        <div class="header">
          <div class="heyebrow">Official Document</div>
          <div class="htitle">${e(title)}</div>
          <div class="hrule"></div>
        </div>
        <div class="body">
          <div class="presented">Presented to</div>
          <div class="rname">${e(name)}</div>
          <div class="divider"></div>
          ${course ? `<div class="cintro">For successfully completing</div><div class="cname">${e(course)}</div>` : ''}
          <div class="bottom">
            <div><div class="mdate">${e(dateStr)}</div>${issuer ? `<div class="missuer">${e(issuer)}</div>` : ''}</div>
            <div class="sigblock">
              <div class="sigscript">${e(issuerTitle || issuer || 'Signature')}</div>
              <div class="sigline"></div>
              <div class="siglabel">Authorized Signature</div>
            </div>
            <div></div>
          </div>
        </div>
      </div></body></html>`;
    }

    // =================================================================
    // HERITAGE (formal)
    // =================================================================
    const bg = '#0F1729', gold = '#C9A84C', goldL = '#E8CB7A', cream = '#F5ECD7';
    const corner = `<svg viewBox="0 0 100 100" style="width:100px;height:100px;" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="2" x2="100" y2="2" stroke="${gold}" stroke-width="2.5"/>
      <line x1="2" y1="0" x2="2" y2="100" stroke="${gold}" stroke-width="2.5"/>
      <line x1="8" y1="8" x2="100" y2="8" stroke="${gold}" stroke-width="0.8"/>
      <line x1="8" y1="8" x2="8" y2="100" stroke="${gold}" stroke-width="0.8"/>
      <rect x="0" y="0" width="28" height="28" fill="${gold}" opacity="0.12"/>
      <rect x="13" y="13" width="10" height="10" fill="${gold}" transform="rotate(45,18,18)"/>
      <circle cx="46" cy="2" r="2.5" fill="${gold}"/>
      <circle cx="2" cy="46" r="2.5" fill="${gold}"/>
      <path d="M22,10 Q28,8 30,14" stroke="${gold}" stroke-width="0.8" fill="none"/>
      <path d="M10,22 Q8,28 14,30" stroke="${gold}" stroke-width="0.8" fill="none"/>
    </svg>`;
    const flourish = `<svg viewBox="0 0 700 36" style="width:700px;height:36px;display:block;margin:0 auto;" xmlns="http://www.w3.org/2000/svg">
      <rect x="344" y="13" width="12" height="12" fill="${gold}" transform="rotate(45,350,19)"/>
      <rect x="338" y="16" width="6" height="6" fill="${gold}" opacity="0.5" transform="rotate(45,341,19)"/>
      <rect x="356" y="16" width="6" height="6" fill="${gold}" opacity="0.5" transform="rotate(45,359,19)"/>
      <line x1="0" y1="19" x2="322" y2="19" stroke="${gold}" stroke-width="0.8" opacity="0.6"/>
      <line x1="700" y1="19" x2="378" y2="19" stroke="${gold}" stroke-width="0.8" opacity="0.6"/>
      <path d="M322,19 Q330,19 330,12 Q330,5 340,5" stroke="${gold}" stroke-width="1.2" fill="none"/>
      <path d="M378,19 Q370,19 370,12 Q370,5 360,5" stroke="${gold}" stroke-width="1.2" fill="none"/>
      <path d="M270,19 Q278,19 278,14 Q278,9 285,9" stroke="${gold}" stroke-width="0.8" fill="none" opacity="0.6"/>
      <path d="M430,19 Q422,19 422,14 Q422,9 415,9" stroke="${gold}" stroke-width="0.8" fill="none" opacity="0.6"/>
      <circle cx="285" cy="9" r="2" fill="${gold}" opacity="0.5"/>
      <circle cx="415" cy="9" r="2" fill="${gold}" opacity="0.5"/>
    </svg>`;
    const notches = Array.from({length:24},(_,i)=>{const a=(i/24)*Math.PI*2,x1=(60+53*Math.cos(a)).toFixed(1),y1=(60+53*Math.sin(a)).toFixed(1),x2=(60+57*Math.cos(a)).toFixed(1),y2=(60+57*Math.sin(a)).toFixed(1);return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${gold}" stroke-width="1.8"/>`;}).join('');
    const medal = `<svg viewBox="0 0 120 120" style="width:105px;height:105px;" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="57" fill="${bg}" stroke="${gold}" stroke-width="2.5"/>
      <circle cx="60" cy="60" r="50" fill="none" stroke="${gold}" stroke-width="0.8"/>
      <circle cx="60" cy="60" r="43" fill="none" stroke="${gold}" stroke-width="0.4" stroke-dasharray="2,3"/>
      ${notches}
      <path d="M22,68 Q14,58 18,47 Q22,37 29,40 Q24,50 27,58 Q29,65 22,68Z" fill="${gold}" opacity="0.7"/>
      <path d="M26,76 Q17,68 20,57 Q23,47 31,50 Q26,60 28,68 Q30,74 26,76Z" fill="${gold}" opacity="0.55"/>
      <path d="M98,68 Q106,58 102,47 Q98,37 91,40 Q96,50 93,58 Q91,65 98,68Z" fill="${gold}" opacity="0.7"/>
      <path d="M94,76 Q103,68 100,57 Q97,47 89,50 Q94,60 92,68 Q90,74 94,76Z" fill="${gold}" opacity="0.55"/>
      <path d="M60,22 L80,30 L80,56 Q80,76 60,86 Q40,76 40,56 L40,30 Z" fill="${gold}" opacity="0.12"/>
      <path d="M60,22 L80,30 L80,56 Q80,76 60,86 Q40,76 40,56 L40,30 Z" fill="none" stroke="${gold}" stroke-width="1.5"/>
      <rect x="50" y="42" width="20" height="14" rx="1" fill="none" stroke="${goldL}" stroke-width="1.2"/>
      <line x1="60" y1="42" x2="60" y2="56" stroke="${goldL}" stroke-width="1"/>
      <circle cx="60" cy="68" r="6" fill="none" stroke="${gold}" stroke-width="1"/>
      <line x1="54" y1="68" x2="66" y2="68" stroke="${gold}" stroke-width="0.7"/>
      <text x="60" y="100" font-family="sans-serif" font-size="6" font-weight="bold" fill="${gold}" text-anchor="middle" letter-spacing="2">OFFICIAL SEAL</text>
    </svg>`;
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600;1,700&family=Dancing+Script:wght@600;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{width:1100px;height:850px;overflow:hidden;background:${bg};}
      .page{width:1100px;height:850px;position:relative;background:${bg};display:flex;flex-direction:column;overflow:hidden;}
      .corner{position:absolute;z-index:5;}.c-tl{top:0;left:0;}.c-tr{top:0;right:0;transform:scaleX(-1);}.c-bl{bottom:0;left:0;transform:scaleY(-1);}.c-br{bottom:0;right:0;transform:scale(-1);}
      /* FONT SIZES: print-correct */
      .content{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;padding:55px 110px 15px;flex:1;}
      .ctitle{font-family:"Cinzel",serif;font-size:30px;font-weight:700;color:${gold};letter-spacing:8px;text-align:center;margin-bottom:12px;}
      .presented{font-family:"EB Garamond",serif;font-style:italic;font-size:20px;color:rgba(245,236,215,0.6);margin-bottom:4px;text-align:center;}
      .rname{font-family:"Cormorant Garamond",serif;font-size:78px;font-weight:700;font-style:italic;color:${gold};text-align:center;line-height:1;letter-spacing:1px;margin-bottom:8px;text-shadow:0 0 40px rgba(201,168,76,0.25);}
      .nrule{width:500px;height:1px;background:linear-gradient(90deg,transparent,${gold} 20%,${gold} 80%,transparent);margin:0 auto 12px;}
      .recog{font-family:"EB Garamond",serif;font-style:italic;font-size:18px;color:rgba(245,236,215,0.65);text-align:center;line-height:1.6;margin-bottom:6px;}
      .cname{font-family:"Cinzel",serif;font-size:26px;font-weight:700;color:${goldL};letter-spacing:4px;text-align:center;text-transform:uppercase;}
      .footer{position:relative;z-index:2;display:flex;align-items:flex-end;justify-content:space-between;padding:0 100px 38px;}
      .sigblock{flex:1;display:flex;flex-direction:column;align-items:center;}
      .sigscript{font-family:"Dancing Script",cursive;font-size:34px;color:${cream};line-height:1;margin-bottom:5px;}
      .siglineg{width:220px;height:1px;background:linear-gradient(90deg,transparent,${gold} 30%,${gold} 70%,transparent);margin-bottom:6px;}
      .signame{font-family:"Cinzel",serif;font-size:15px;font-weight:600;color:${gold};letter-spacing:2px;margin-bottom:3px;}
      .sigtitle{font-family:"EB Garamond",serif;font-size:13px;color:rgba(245,236,215,0.55);font-style:italic;}
      .sigdate{font-family:"EB Garamond",serif;font-size:16px;color:${gold};opacity:0.7;margin-top:6px;}
    </style></head><body><div class="page">
      <div style="position:absolute;top:2px;left:100px;right:100px;height:2.5px;background:${gold};z-index:4;"></div>
      <div style="position:absolute;bottom:2px;left:100px;right:100px;height:2.5px;background:${gold};z-index:4;"></div>
      <div style="position:absolute;left:2px;top:100px;bottom:100px;width:2.5px;background:${gold};z-index:4;"></div>
      <div style="position:absolute;right:2px;top:100px;bottom:100px;width:2.5px;background:${gold};z-index:4;"></div>
      <div style="position:absolute;top:8px;left:108px;right:108px;height:0.8px;background:${gold};opacity:0.5;z-index:4;"></div>
      <div style="position:absolute;bottom:8px;left:108px;right:108px;height:0.8px;background:${gold};opacity:0.5;z-index:4;"></div>
      <div style="position:absolute;left:8px;top:108px;bottom:108px;width:0.8px;background:${gold};opacity:0.5;z-index:4;"></div>
      <div style="position:absolute;right:8px;top:108px;bottom:108px;width:0.8px;background:${gold};opacity:0.5;z-index:4;"></div>
      <div class="corner c-tl">${corner}</div><div class="corner c-tr">${corner}</div>
      <div class="corner c-bl">${corner}</div><div class="corner c-br">${corner}</div>
      <div class="content">
        <div class="ctitle">${e(title)}</div>
        ${flourish}
        <div class="presented">Presented to</div>
        <div class="rname">${e(name)}</div>
        <div class="nrule"></div>
        ${course ? `<div class="recog">In recognition of outstanding completion of</div><div class="cname">${e(course)}</div>` : ''}
      </div>
      <div class="footer">
        <div style="flex-shrink:0;">${medal}</div>
        <div class="sigblock">
          <div class="sigscript">${e(issuer || 'Signature')}</div>
          <div class="siglineg"></div>
          ${issuerTitle ? `<div class="signame">${e(issuerTitle)}</div>` : ''}
          ${issuer ? `<div class="sigtitle">${e(issuer)}</div>` : ''}
          <div class="sigdate">${e(dateStr)}</div>
        </div>
        <div style="flex-shrink:0;width:70px;"></div>
      </div>
    </div></body></html>`;
  }


    // ── Color sync ──

  function syncColor() {
    document.getElementById("accentColorHex").value = document.getElementById("accentColor").value;
    updatePreview();
  }

  // ── Download PDF ──
  async function downloadCertificate() {
    const btn = document.getElementById("btnDownload");
    const origText = btn.textContent;
    btn.textContent = "⏳ Generating...";
    btn.disabled = true;

    try {
      const key = await ensureApiKey();
      if (!key) { showToast("Failed to get API key", "error"); return; }

      const dateVal = document.getElementById("certDate").value;
      const payload = {
        recipient: {
          name: document.getElementById("recipientName").value || "Recipient Name",
        },
        certificate: {
          title: document.getElementById("certTitle").value || "Certificate of Completion",
          course: document.getElementById("courseName").value || undefined,
          date: dateVal || undefined,
          issuer: document.getElementById("issuerName").value || undefined,
          issuer_title: document.getElementById("issuerTitle").value || undefined,
        },
        options: {
          template: document.getElementById("templateSelect").value,
          color: document.getElementById("accentColor").value,
          verification: document.getElementById("verifyToggle").value === "true",
        },
      };

      const res = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": key },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) {
        showToast(data.error || "Generation failed", "error");
        return;
      }

      // Download PDF
      const blob = base64ToBlob(data.pdf, "application/pdf");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${(payload.recipient.name || "cert").replace(/\s+/g, "-").toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      showToast("Certificate downloaded! ✅");

      if (data.verification) {
        showToast(`Verify: ${data.verification.url}`, "success");
      }

    } catch (e) {
      console.error(e);
      showToast("Download failed", "error");
    } finally {
      btn.textContent = origText;
      btn.disabled = false;
    }
  }

  // ── CSV Upload ──
  let csvData = [];

  function handleCsvUpload(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) { showToast("CSV must have header + at least 1 row", "error"); return; }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));
      const nameIdx = headers.indexOf("name");
      if (nameIdx === -1) { showToast("CSV must have a 'name' column", "error"); return; }

      csvData = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim().replace(/"/g, ""));
        if (cols[nameIdx]) {
          csvData.push({
            name: cols[nameIdx],
            course: cols[headers.indexOf("course")] || undefined,
            date: cols[headers.indexOf("date")] || undefined,
          });
        }
      }

      // Show preview table
      const preview = document.getElementById("csvPreview");
      let html = `<table><tr><th>#</th><th>Name</th></tr>`;
      csvData.forEach((r, i) => {
        html += `<tr><td>${i + 1}</td><td>${r.name}</td></tr>`;
      });
      html += `</table><p style="margin-top:8px;color:var(--accent);">${csvData.length} recipients loaded</p>`;
      preview.innerHTML = html;
      preview.style.display = "block";
      showToast(`${csvData.length} recipients loaded from CSV`);
    };
    reader.readAsText(file);
  }

  async function bulkGenerate() {
    if (csvData.length === 0) { showToast("Upload a CSV first", "error"); return; }

    const btn = document.getElementById("btnBulkGenerate");
    btn.textContent = `⏳ Generating ${csvData.length} certificates...`;
    btn.disabled = true;

    try {
      const key = await ensureApiKey();
      if (!key) { showToast("Failed to get API key", "error"); return; }

      // For free tier, generate individually since bulk requires starter+
      // Try bulk first, fall back to individual
      const payload = {
        recipients: csvData.map((r) => ({ name: r.name })),
        certificate: {
          title: document.getElementById("bulkTitle").value || "Certificate of Completion",
          course: document.getElementById("bulkCourse").value || undefined,
          issuer: document.getElementById("bulkIssuer").value || undefined,
        },
        options: {
          template: document.getElementById("bulkTemplate").value,
          verification: true,
        },
      };

      const res = await fetch(`${API_BASE}/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": key },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        // Fall back to individual generation
        if (res.status === 403) {
          showToast("Bulk requires Starter plan. Generating individually...", "error");
          await generateIndividually(key);
          return;
        }
        showToast(data.error || "Bulk generation failed", "error");
        return;
      }

      // Download each as ZIP or individual files
      for (const cert of data.certificates) {
        if (cert.error) continue;
        const blob = base64ToBlob(cert.pdf, "application/pdf");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificate-${cert.recipient.replace(/\s+/g, "-").toLowerCase()}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        await sleep(300); // Small delay between downloads
      }

      showToast(`${data.generated} certificates downloaded! ✅`);

    } catch (e) {
      console.error(e);
      showToast("Bulk generation failed", "error");
    } finally {
      btn.textContent = "⬇ Generate All Certificates";
      btn.disabled = false;
    }
  }

  async function generateIndividually(key) {
    let count = 0;
    for (const recipient of csvData) {
      const payload = {
        recipient: { name: recipient.name },
        certificate: {
          title: document.getElementById("bulkTitle").value || "Certificate of Completion",
          course: document.getElementById("bulkCourse").value || undefined,
          issuer: document.getElementById("bulkIssuer").value || undefined,
        },
        options: { template: document.getElementById("bulkTemplate").value, verification: true },
      };

      try {
        const res = await fetch(`${API_BASE}/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-API-Key": key },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          const blob = base64ToBlob(data.pdf, "application/pdf");
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `certificate-${recipient.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
          count++;
          await sleep(500);
        }
      } catch (e) { console.error(e); }
    }
    showToast(`${count} certificates downloaded! ✅`);
    const btn = document.getElementById("btnBulkGenerate");
    btn.textContent = "⬇ Generate All Certificates";
    btn.disabled = false;
  }

  // ── Helpers ──
  function base64ToBlob(b64, type) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type });
  }

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  // ── Init ──
  document.addEventListener("DOMContentLoaded", () => {
    // Set default date
    document.getElementById("certDate").value = new Date().toISOString().split("T")[0];

    // Bind form inputs to live preview
    const fields = ["recipientName", "certTitle", "courseName", "certDate", "issuerName", "issuerTitle", "templateSelect"];
    fields.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", updatePreview);
      if (el) el.addEventListener("change", updatePreview);
    });

    // Color picker
    document.getElementById("accentColor").addEventListener("input", syncColor);

    // Download button
    document.getElementById("btnDownload").addEventListener("click", downloadCertificate);

    // CSV upload
    const csvArea = document.getElementById("csvUploadArea");
    const csvFile = document.getElementById("csvFile");
    csvArea.addEventListener("click", () => csvFile.click());
    csvArea.addEventListener("dragover", (e) => { e.preventDefault(); csvArea.style.borderColor = "var(--accent)"; });
    csvArea.addEventListener("dragleave", () => { csvArea.style.borderColor = "var(--border)"; });
    csvArea.addEventListener("drop", (e) => {
      e.preventDefault();
      csvArea.style.borderColor = "var(--border)";
      if (e.dataTransfer.files[0]) handleCsvUpload(e.dataTransfer.files[0]);
    });
    csvFile.addEventListener("change", () => { if (csvFile.files[0]) handleCsvUpload(csvFile.files[0]); });

    // Bulk generate
    document.getElementById("btnBulkGenerate").addEventListener("click", bulkGenerate);

    // Initial preview
    updatePreview();
  });
})();
