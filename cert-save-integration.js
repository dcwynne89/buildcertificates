/* ============================================================
   BuildCertificates — Save/Load Integration
   Connects the certificate form to BuildAuth for persistence.
   
   Requires: build-ecosystem-auth.js loaded first
   ============================================================ */
(function () {
  "use strict";

  // Wait for BuildAuth to exist
  function waitForAuth(cb) {
    if (window.BuildAuth) { cb(); return; }
    var t = setInterval(function () {
      if (window.BuildAuth) { clearInterval(t); cb(); }
    }, 200);
  }

  waitForAuth(function () { init(); });

  /* ── Read form state from DOM ─────────────────────────────── */

  function readFormData() {
    return {
      recipient_name: v("recipientName"),
      cert_title:     v("certTitle"),
      course_name:    v("courseName"),
      cert_date:      v("certDate"),
      template:       v("templateSelect"),
      issuer_name:    v("issuerName"),
      issuer_title:   v("issuerTitle"),
      accent_color:   v("accentColor"),
      accent_hex:     v("accentColorHex"),
      verify_toggle:  v("verifyToggle"),
    };
  }

  function v(id) { var el = document.getElementById(id); return el ? el.value : ""; }

  /* ── Write form state to DOM ──────────────────────────────── */

  function loadFormData(data) {
    setVal("recipientName", data.recipient_name);
    setVal("certTitle",     data.cert_title);
    setVal("courseName",    data.course_name);
    setVal("certDate",      data.cert_date);
    setVal("templateSelect", data.template);
    setVal("issuerName",    data.issuer_name);
    setVal("issuerTitle",   data.issuer_title);
    setVal("verifyToggle",  data.verify_toggle);

    if (data.accent_color) {
      setVal("accentColor", data.accent_color);
      setVal("accentColorHex", data.accent_hex || data.accent_color);
      if (window.accentColor !== undefined) window.accentColor = data.accent_color;
    }

    // Trigger template change if the app exposes it
    var tplEl = document.getElementById("templateSelect");
    if (tplEl) tplEl.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function setVal(id, val) {
    var el = document.getElementById(id);
    if (el && val !== undefined && val !== null) {
      el.value = val;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  /* ── Build title from form data ───────────────────────────── */

  function buildTitle(data) {
    var title = data.cert_title || "Certificate of Completion";
    if (data.recipient_name) title += " — " + data.recipient_name;
    return title;
  }

  /* ── Inject UI ────────────────────────────────────────────── */

  function init() {
    injectSaveButton();
    injectSavedPanel();

    BuildAuth.onAuthChange(function (user) {
      var panel = document.getElementById("bcs-saved-panel");
      var saveBtn = document.getElementById("bcs-save-btn");
      var hint = document.getElementById("bcs-save-hint");

      if (user) {
        if (saveBtn) saveBtn.style.display = "";
        if (hint) hint.style.display = "none";
        if (panel) { panel.style.display = ""; loadSavedCerts(); }
      } else {
        if (saveBtn) saveBtn.style.display = "none";
        if (hint) hint.style.display = "";
        if (panel) panel.style.display = "none";
      }
    });
  }

  function injectSaveButton() {
    var dlBtn = document.getElementById("btnDownload");
    if (!dlBtn) return;

    // Wrap the standalone download button in a flex row
    var wrapper = document.createElement("div");
    wrapper.style.cssText = "display:flex;gap:0.75rem;align-items:stretch;";
    dlBtn.parentElement.insertBefore(wrapper, dlBtn);
    wrapper.appendChild(dlBtn);

    // Save button (hidden until signed in)
    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.id = "bcs-save-btn";
    saveBtn.style.cssText = "display:none;background:rgba(197,165,90,0.15);border:1px solid rgba(197,165,90,0.3);color:#d4af37;padding:0.75rem 1.25rem;border-radius:12px;font-weight:600;font-size:0.95rem;cursor:pointer;transition:all 0.2s;white-space:nowrap;font-family:inherit;";
    saveBtn.textContent = "💾 Save";
    saveBtn.title = "Save this certificate to your account";
    saveBtn.addEventListener("mouseenter", function () { saveBtn.style.background = "rgba(197,165,90,0.25)"; });
    saveBtn.addEventListener("mouseleave", function () { saveBtn.style.background = "rgba(197,165,90,0.15)"; });
    saveBtn.addEventListener("click", handleSave);
    wrapper.appendChild(saveBtn);

    // "Sign in to save" hint (shown when signed out)
    var hint = document.createElement("button");
    hint.type = "button";
    hint.id = "bcs-save-hint";
    hint.className = "bea-save-hint";
    hint.textContent = "💾 Sign in to save your certificates";
    hint.style.marginTop = "0.75rem";
    hint.addEventListener("click", function () { BuildAuth.showSignIn(); });
    wrapper.parentElement.appendChild(hint);
  }

  async function handleSave() {
    var btn = document.getElementById("bcs-save-btn");
    btn.textContent = "Saving...";
    btn.disabled = true;

    var data = readFormData();
    var title = buildTitle(data);

    var docId = await BuildAuth.saveDocument("certificate", title, data, {
      clientName: data.recipient_name,
      status: "draft",
    });

    if (docId) {
      btn.textContent = "✓ Saved";
      setTimeout(function () { btn.textContent = "💾 Save"; btn.disabled = false; }, 2000);
      loadSavedCerts();
    } else {
      btn.textContent = "✗ Error";
      setTimeout(function () { btn.textContent = "💾 Save"; btn.disabled = false; }, 2000);
    }
  }

  /* ── Saved Certificates Panel ─────────────────────────────── */

  function injectSavedPanel() {
    var form = document.querySelector(".form-panel, .form-card, #singlePanel");
    if (!form) form = document.querySelector("main") || document.querySelector(".container");
    if (!form) return;

    var panel = document.createElement("div");
    panel.id = "bcs-saved-panel";
    panel.style.cssText = "display:none;margin-bottom:2rem;background:rgba(197,165,90,0.04);border:1px solid rgba(197,165,90,0.12);border-radius:16px;padding:1.5rem;";
    panel.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">' +
        '<h3 style="margin:0;font-size:1rem;font-weight:700;color:rgba(255,255,255,0.85);">🏅 Your Saved Certificates</h3>' +
        '<button id="bcs-refresh" style="background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:0.85rem;">↻ Refresh</button>' +
      '</div>' +
      '<div id="bcs-list" style="display:flex;flex-direction:column;gap:0.5rem;"></div>';

    form.parentElement.insertBefore(panel, form);

    document.getElementById("bcs-refresh")?.addEventListener("click", loadSavedCerts);
  }

  async function loadSavedCerts() {
    var list = document.getElementById("bcs-list");
    if (!list) return;

    list.innerHTML = '<div style="color:rgba(255,255,255,0.3);font-size:0.85rem;">Loading...</div>';

    var docs = await BuildAuth.loadDocuments("certificate");

    if (docs.length === 0) {
      list.innerHTML = '<div style="color:rgba(255,255,255,0.3);font-size:0.85rem;">No saved certificates yet. Create a certificate and click 💾 Save.</div>';
      return;
    }

    list.innerHTML = "";
    docs.forEach(function (doc) {
      var row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;cursor:pointer;transition:all 0.15s;";
      row.addEventListener("mouseenter", function () { row.style.background = "rgba(255,255,255,0.06)"; });
      row.addEventListener("mouseleave", function () { row.style.background = "rgba(255,255,255,0.03)"; });

      var info = document.createElement("div");
      info.innerHTML =
        '<div style="font-size:0.9rem;font-weight:600;color:rgba(255,255,255,0.8);">' + escHtml(doc.title) + '</div>' +
        '<div style="font-size:0.75rem;color:rgba(255,255,255,0.35);margin-top:2px;">' +
          (doc.clientName ? escHtml(doc.clientName) + " · " : "") +
          formatDate(doc.createdAt) +
        '</div>';

      var actions = document.createElement("div");
      actions.style.cssText = "display:flex;gap:6px;flex-shrink:0;";

      var loadBtn = document.createElement("button");
      loadBtn.style.cssText = "background:rgba(197,165,90,0.15);border:1px solid rgba(197,165,90,0.25);color:#d4af37;padding:5px 12px;border-radius:8px;font-size:0.8rem;cursor:pointer;font-family:inherit;";
      loadBtn.textContent = "Load";
      loadBtn.addEventListener("click", function (e) { e.stopPropagation(); loadCert(doc.id); });

      var delBtn = document.createElement("button");
      delBtn.style.cssText = "background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);color:#f87171;padding:5px 10px;border-radius:8px;font-size:0.8rem;cursor:pointer;font-family:inherit;";
      delBtn.textContent = "✕";
      delBtn.title = "Delete";
      delBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (confirm("Delete this saved certificate?")) {
          BuildAuth.deleteDocument(doc.id).then(function () { loadSavedCerts(); });
        }
      });

      actions.appendChild(loadBtn);
      actions.appendChild(delBtn);
      row.appendChild(info);
      row.appendChild(actions);
      list.appendChild(row);
    });
  }

  async function loadCert(docId) {
    var doc = await BuildAuth.getDocument(docId);
    if (!doc || !doc.formData) { alert("Could not load certificate."); return; }
    loadFormData(doc.formData);
    var form = document.querySelector(".form-panel, .form-card, #singlePanel, main");
    if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ── Helpers ──────────────────────────────────────────────── */

  function escHtml(str) {
    var d = document.createElement("div");
    d.textContent = str || "";
    return d.innerHTML;
  }

  function formatDate(ts) {
    if (!ts) return "";
    var d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
})();
