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

  // ── Live Preview ──
  function updatePreview() {
    const name = document.getElementById("recipientName").value || "Recipient Name";
    const title = document.getElementById("certTitle").value || "Certificate of Completion";
    const course = document.getElementById("courseName").value || "";
    const date = document.getElementById("certDate").value
      ? new Date(document.getElementById("certDate").value + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "";
    const issuer = document.getElementById("issuerName").value || "";
    const issuerTitle = document.getElementById("issuerTitle").value || "";
    const color = document.getElementById("accentColor").value;
    const template = document.getElementById("templateSelect").value;

    let previewHtml = "";

    if (template === "elegant") {
      previewHtml = `
        <div class="preview-cert" style="--accent: ${color}">
          <div class="border-frame" style="border-color: ${color}"></div>
          <div class="inner-frame" style="border-color: ${color}"></div>
          <div class="cert-ornament" style="color: ${color}">✦</div>
          <div class="cert-title" style="color: #1B365D">${title.toUpperCase()}</div>
          <div class="cert-divider" style="background: ${color}"></div>
          <div class="cert-presented">This is proudly presented to</div>
          <div class="cert-recipient">${name}</div>
          <div class="cert-name-line" style="background: ${color}"></div>
          ${course ? `<div class="cert-course">For successfully completing ${course}</div>` : ""}
          ${date ? `<div class="cert-date">${date}</div>` : ""}
          <div class="cert-footer">
            <div class="cert-issuer">
              <div class="cert-sig-line"></div>
              ${issuer ? `<div class="cert-issuer-name">${issuer}</div>` : ""}
              ${issuerTitle ? `<div class="cert-issuer-title">${issuerTitle}</div>` : ""}
            </div>
          </div>
        </div>`;
    } else if (template === "modern") {
      previewHtml = `
        <div class="preview-cert" style="align-items: flex-start; padding: 32px;">
          <div style="width:100%;height:6px;background:${color};position:absolute;top:0;left:0;"></div>
          <div style="font-size:11px;font-weight:700;letter-spacing:4px;color:${color};margin-top:20px;margin-bottom:24px;">${title.toUpperCase()}</div>
          <div style="font-size:28px;font-weight:800;color:#111;margin-bottom:8px;">${name}</div>
          ${course ? `<div style="font-size:11px;color:#555;margin-bottom:30px;">For successfully completing ${course}</div>` : '<div style="margin-bottom:30px;"></div>'}
          ${date ? `<div style="font-size:9px;color:#888;margin-bottom:14px;">${date}</div>` : ""}
          <div style="width:140px;height:1px;background:#ddd;margin-bottom:4px;"></div>
          ${issuer ? `<div style="font-size:9px;font-weight:600;color:#222;">${issuer}</div>` : ""}
          ${issuerTitle ? `<div style="font-size:7px;color:#888;">${issuerTitle}</div>` : ""}
          <div style="width:100%;height:3px;background:${color};position:absolute;bottom:0;left:0;"></div>
        </div>`;
    } else if (template === "formal") {
      previewHtml = `
        <div class="preview-cert" style="background:#FEFCF7;">
          <div style="position:absolute;inset:6px;border:3px solid ${color};"></div>
          <div style="position:absolute;inset:12px;border:1px solid ${color};"></div>
          <div style="font-size:12px;color:${color};margin-bottom:8px;">— ✦ —</div>
          <div style="font-size:18px;font-weight:700;color:${color};margin-bottom:4px;">${title}</div>
          <div style="width:100px;height:1px;background:${color};margin:6px 0 14px;"></div>
          <div style="font-size:9px;color:#555;margin-bottom:10px;">This certificate is presented to</div>
          <div style="font-size:22px;font-weight:700;color:#111;margin-bottom:4px;">${name}</div>
          <div style="width:160px;height:1px;background:#ccc;margin-bottom:10px;"></div>
          ${course ? `<div style="font-size:9px;color:#444;margin-bottom:16px;">In recognition of completing ${course}</div>` : '<div style="margin-bottom:16px;"></div>'}
          ${date ? `<div style="font-size:8px;color:#777;margin-bottom:14px;">${date}</div>` : ""}
          <div class="cert-footer">
            <div style="width:50px;height:50px;border-radius:50%;border:2px solid ${color};display:flex;align-items:center;justify-content:center;">
              <span style="font-size:5px;font-weight:700;color:${color};text-align:center;line-height:1.2;">OFFICIAL<br>SEAL</span>
            </div>
            <div class="cert-issuer">
              <div class="cert-sig-line"></div>
              ${issuer ? `<div class="cert-issuer-name">${issuer}</div>` : ""}
              ${issuerTitle ? `<div class="cert-issuer-title">${issuerTitle}</div>` : ""}
            </div>
          </div>
        </div>`;
    }

    document.getElementById("previewBody").innerHTML = previewHtml;
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
