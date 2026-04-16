/* ============================================================
   render-pdf.js — HTML/CSS → PDF via headless Chromium
   Uses @sparticuz/chromium + puppeteer-core (serverless-safe)
   ============================================================ */

let _browser = null;

async function getBrowser() {
  if (_browser && _browser.isConnected()) return _browser;
  const chromium = require("@sparticuz/chromium");
  const puppeteer = require("puppeteer-core");
  chromium.setHeadlessMode = true;
  chromium.setGraphicsMode = false;

  _browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  return _browser;
}

/**
 * Render an HTML string to a PDF buffer (landscape letter by default).
 * @param {string} html       Full HTML document string
 * @param {object} opts
 * @param {string} opts.format   puppeteer paper format, default 'letter'
 * @param {boolean} opts.landscape
 * @returns {Promise<Buffer>}
 */
async function renderHtmlToPdf(html, opts = {}) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 20000 });
    const pdfBuffer = await page.pdf({
      format: opts.format || "letter",
      landscape: opts.landscape !== false,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}

module.exports = { renderHtmlToPdf };
