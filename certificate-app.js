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

    // Inject into iframe (srcdoc = same-origin, no CSP issues)
    let iframe = document.getElementById("previewIframe");
    if (!iframe) {
      const previewBody = document.getElementById("previewBody");
      previewBody.innerHTML = "";
      previewBody.style.cssText = "padding:0;background:#666;display:flex;align-items:center;justify-content:center;height:100%;";
      iframe = document.createElement("iframe");
      iframe.id = "previewIframe";
      iframe.style.cssText = "width:1100px;height:850px;border:none;transform:scale(0.44);transform-origin:top left;flex-shrink:0;display:block;";
      previewBody.style.overflow = "hidden";
      previewBody.appendChild(iframe);
      // Wrapper to handle transform offset
      previewBody.style.height = "374px";  // 850 * 0.44
    }
    iframe.srcdoc = html;
  }

  // ── Build preview HTML (mirrors Chromium templates exactly) ──
  function buildPreviewHtml({ name, title, course, dateStr, issuer, issuerTitle, color, template }) {
    if (template === "elegant") {
      const navy = color || "#1B365D";
      const gold = "#C5A55A";
      return `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1100px;height:850px;overflow:hidden;background:#FDFAF3;}
.page{width:1100px;height:850px;position:relative;background:#FDFAF3;display:flex;flex-direction:column;overflow:hidden;}
.header-band{background:linear-gradient(135deg,${navy} 0%,#24477a 60%,#1a3560 100%);padding:48px 80px 44px;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;}
.header-band::after{content:'';position:absolute;bottom:-3px;left:0;right:0;height:5px;background:linear-gradient(90deg,transparent 0%,${gold} 20%,${gold} 80%,transparent 100%);}
.header-ornament{font-size:11px;color:${gold};letter-spacing:8px;margin-bottom:6px;opacity:.85;}
.header-title{font-family:'Cinzel',serif;font-size:32px;font-weight:700;color:#fff;letter-spacing:7px;text-transform:uppercase;}
.header-rule{margin-top:8px;width:340px;height:1px;background:linear-gradient(90deg,transparent,${gold},transparent);}
.body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:22px 80px 15px;position:relative;}
.body::before{content:'';position:absolute;left:32px;top:0;bottom:0;width:3px;background:linear-gradient(180deg,transparent,${gold} 20%,${gold} 80%,transparent);}
.body::after{content:'';position:absolute;right:32px;top:0;bottom:0;width:3px;background:linear-gradient(180deg,transparent,${gold} 20%,${gold} 80%,transparent);}
.presented-to{font-family:'EB Garamond',serif;font-style:italic;font-size:14px;color:#777;margin-bottom:4px;letter-spacing:1px;}
.recipient-name{font-family:'Cormorant Garamond',serif;font-size:60px;font-weight:600;color:${navy};line-height:1.05;text-align:center;margin-bottom:2px;}
.name-rule{width:420px;height:2px;background:linear-gradient(90deg,transparent,${gold} 15%,${gold} 85%,transparent);margin:8px auto 14px;}
.course-label{font-family:'EB Garamond',serif;font-style:italic;font-size:13px;color:#666;text-align:center;margin-bottom:3px;}
.course-name{font-family:'Cinzel',serif;font-size:15px;font-weight:600;color:#333;text-align:center;letter-spacing:2px;margin-bottom:10px;}
.date-text{font-family:'EB Garamond',serif;font-size:12px;color:#999;text-align:center;}
.footer-row{display:flex;align-items:flex-end;padding:10px 64px 15px;gap:0;flex-shrink:0;border-top:1px solid rgba(197,165,90,.25);}
.sig-block{flex:1;}.sig-label{font-family:'EB Garamond',serif;font-size:9px;color:#bbb;letter-spacing:1px;text-transform:uppercase;margin-bottom:5px;}
.sig-line{width:160px;height:1px;background:#ccc;margin-bottom:6px;}
.sig-name{font-family:'Cinzel',serif;font-size:11px;font-weight:600;color:#333;}
.sig-title{font-family:'EB Garamond',serif;font-size:10px;color:#888;margin-top:2px;}
.seal-block{width:90px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:4px;}
.seal-ring{width:68px;height:68px;border-radius:50%;border:3px solid ${gold};display:flex;align-items:center;justify-content:center;background:transparent;position:relative;}
.seal-ring::before{content:'';position:absolute;inset:5px;border-radius:50%;border:1px solid ${gold};opacity:.6;}
.seal-icon{font-size:22px;color:${gold};}
.qr-block{flex:1;display:flex;flex-direction:column;align-items:flex-end;}
</style></head><body><div class="page">
<div class="header-band">
  <div class="header-ornament">✦ &nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp; ✦</div>
  <div class="header-title">${title}</div>
  <div class="header-rule"></div>
</div>
<div class="body">
  <div class="presented-to">This is proudly presented to</div>
  <div class="recipient-name">${name}</div>
  <div class="name-rule"></div>
  ${course ? `<div class="course-label">For successfully completing</div><div class="course-name">${course}</div>` : ""}
  <div class="date-text">${dateStr}</div>
</div>
<div class="footer-row">
  <div class="sig-block">
    <div class="sig-label">Authorized Signature</div>
    <div class="sig-line"></div>
    ${issuer ? `<div class="sig-name">${issuer}</div>` : ""}
    ${issuerTitle ? `<div class="sig-title">${issuerTitle}</div>` : ""}
  </div>
  <div class="seal-block"><div class="seal-ring"><span class="seal-icon">✦</span></div></div>
  <div class="qr-block"></div>
</div>
</div></body></html>`;
    }

    if (template === "modern") {
      const c = color || "#4F46E5";
      const tint = c + "12"; // ~7% opacity hex
      return `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1100px;height:850px;overflow:hidden;background:#fff;}
.page{width:1100px;height:850px;position:relative;background:#fff;display:flex;overflow:hidden;}
.left-col{width:18px;background:linear-gradient(180deg,${c} 0%,${c}cc 100%);flex-shrink:0;}
.main{flex:1;display:flex;flex-direction:column;}
.top-band{height:8px;background:${c};flex-shrink:0;}
.content{flex:1;display:flex;flex-direction:column;justify-content:center;padding:35px 75px 25px;}
.name-block{background:${tint};border-left:4px solid ${c};padding:20px 25px 18px;margin-bottom:18px;}
.type-label{font-family:'Inter',sans-serif;font-size:10px;font-weight:700;color:${c};letter-spacing:6px;text-transform:uppercase;margin-bottom:10px;}
.recipient-name{font-family:'Inter',sans-serif;font-size:62px;font-weight:800;color:#111;line-height:1;letter-spacing:-1px;}
.course-text{font-family:'Inter',sans-serif;font-size:15px;color:#555;margin-top:8px;}
.divider{height:1px;background:linear-gradient(90deg,#e5e7eb 0%,#e5e7eb 70%,transparent 100%);margin:22px 0 18px;}
.bottom-row{display:flex;align-items:flex-start;gap:30px;}
.issuer-block{flex:1;}.issuer-accent{width:40px;height:3px;background:${c};border-radius:2px;margin-bottom:8px;}
.issuer-name{font-family:'Inter',sans-serif;font-size:13px;font-weight:700;color:#111;margin-bottom:2px;}
.issuer-title{font-family:'Inter',sans-serif;font-size:11px;color:#888;}
.date-block{text-align:right;}.date-label{font-family:'Inter',sans-serif;font-size:8px;font-weight:700;color:#bbb;letter-spacing:3px;text-transform:uppercase;margin-bottom:5px;}
.date-value{font-family:'Inter',sans-serif;font-size:13px;font-weight:600;color:#333;}
.bottom-band{height:8px;background:${c};flex-shrink:0;margin-top:auto;}
</style></head><body><div class="page">
<div class="left-col"></div>
<div class="main">
  <div class="top-band"></div>
  <div class="content">
    <div class="name-block">
      <div class="type-label">${title}</div>
      <div class="recipient-name">${name}</div>
      ${course ? `<div class="course-text">For successfully completing <strong>${course}</strong></div>` : ""}
    </div>
    <div class="divider"></div>
    <div class="bottom-row">
      <div style="width:72px;flex-shrink:0;"></div>
      <div class="issuer-block">
        <div class="issuer-accent"></div>
        ${issuer ? `<div class="issuer-name">${issuer}</div>` : ""}
        ${issuerTitle ? `<div class="issuer-title">${issuerTitle}</div>` : ""}
      </div>
      <div class="date-block">
        <div class="date-label">Date Issued</div>
        <div class="date-value">${dateStr}</div>
      </div>
    </div>
  </div>
  <div class="bottom-band"></div>
</div>
</div></body></html>`;
    }

    // Formal
    const fc = color || "#6B1D2A";
    const fg = "#B8962E";
    return `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=IM+Fell+English:ital@0;1&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600;1,700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1100px;height:850px;overflow:hidden;background:#F5EDD8;}
.page{width:1100px;height:850px;position:relative;background:#F5EDD8;display:flex;flex-direction:column;overflow:hidden;}
.border-top{position:absolute;top:2px;left:72px;right:72px;height:3.5px;background:${fc};}
.border-bottom{position:absolute;bottom:2px;left:72px;right:72px;height:3.5px;background:${fc};}
.border-left{position:absolute;left:2px;top:72px;bottom:72px;width:3.5px;background:${fc};}
.border-right{position:absolute;right:2px;top:72px;bottom:72px;width:3.5px;background:${fc};}
.inner-panel{position:absolute;top:55px;bottom:55px;left:55px;right:55px;background:rgba(253,250,243,.7);z-index:0;}
.content{position:relative;z-index:5;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 80px 15px;}
.cert-title{font-family:'Cinzel',serif;font-size:28px;font-weight:700;color:${fc};letter-spacing:4px;text-align:center;margin-bottom:6px;}
.flourish{display:flex;align-items:center;gap:0;width:460px;margin:0 auto 10px;}
.fl-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,${fc});}
.fl-line.r{background:linear-gradient(90deg,${fc},transparent);}
.fl-gem{width:10px;height:10px;background:${fg};transform:rotate(45deg);flex-shrink:0;margin:0 8px;}
.presented-to{font-family:'IM Fell English',serif;font-style:italic;font-size:14px;color:#777;text-align:center;margin-bottom:5px;}
.recipient-name{font-family:'Cormorant Garamond',serif;font-size:58px;font-weight:700;font-style:italic;color:#1a1a1a;text-align:center;line-height:1.05;margin-bottom:5px;}
.name-rule{width:380px;height:1px;background:linear-gradient(90deg,transparent,#ccc 20%,#ccc 80%,transparent);margin:0 auto 12px;}
.course-label{font-family:'IM Fell English',serif;font-style:italic;font-size:12px;color:#666;text-align:center;margin-bottom:4px;}
.course-name{font-family:'Cinzel',serif;font-size:16px;font-weight:600;color:${fc};letter-spacing:3px;text-transform:uppercase;text-align:center;margin-bottom:10px;}
.date-text{font-family:'IM Fell English',serif;font-size:12px;color:#999;text-align:center;}
.footer-row{position:relative;z-index:5;display:flex;align-items:center;padding:5px 80px 45px;gap:0;}
.sig-block{flex:1;text-align:center;}.sig-line{width:220px;height:1px;background:#aaa;margin:0 auto 7px;}
.sig-name{font-family:'Cinzel',serif;font-size:11px;font-weight:600;color:#333;}
.sig-title{font-family:'IM Fell English',serif;font-size:10px;color:#888;margin-top:2px;font-style:italic;}
</style></head><body><div class="page">
<div class="border-top"></div><div class="border-bottom"></div>
<div class="border-left"></div><div class="border-right"></div>
<div class="inner-panel"></div>
<div class="content">
  <div class="cert-title">${title}</div>
  <div class="flourish"><div class="fl-line"></div><div class="fl-gem"></div><div class="fl-line r"></div></div>
  <div class="presented-to">Presented to</div>
  <div class="recipient-name">${name}</div>
  <div class="name-rule"></div>
  ${course ? `<div class="course-label">In recognition of completing</div><div class="course-name">${course}</div>` : ""}
  <div class="date-text">${dateStr}</div>
</div>
<div class="footer-row">
  <div style="width:80px;flex-shrink:0;">
    <svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="37" fill="none" stroke="${fc}" stroke-width="3"/>
      <circle cx="40" cy="40" r="30" fill="none" stroke="${fc}" stroke-width="1"/>
      <circle cx="40" cy="40" r="22" fill="none" stroke="${fg}" stroke-width=".8" opacity=".8"/>
      <text x="40" y="34" font-family="sans-serif" font-size="7" font-weight="bold" fill="${fc}" text-anchor="middle" letter-spacing="2">OFFICIAL</text>
      <text x="40" y="44" font-family="sans-serif" font-size="11" fill="${fg}" text-anchor="middle">✦</text>
      <text x="40" y="54" font-family="sans-serif" font-size="7" font-weight="bold" fill="${fc}" text-anchor="middle" letter-spacing="2">SEAL</text>
    </svg>
  </div>
  <div class="sig-block">
    <div class="sig-line"></div>
    ${issuer ? `<div class="sig-name">${issuer}</div>` : ""}
    ${issuerTitle ? `<div class="sig-title">${issuerTitle}</div>` : ""}
  </div>
  <div style="width:80px;flex-shrink:0;"></div>
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
