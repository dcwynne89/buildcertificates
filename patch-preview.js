const fs = require('fs');
let src = fs.readFileSync('certificate-app.js', 'utf8');

// Find the old buildPreviewHtml function boundaries
const start = src.indexOf('  // -- Build preview HTML (mirrors Chromium templates exactly) --');
const end   = src.indexOf('  // \u2500\u2500 Color sync \u2500\u2500');
if (start === -1 || end === -1) {
  console.error('Markers not found! start=' + start + ' end=' + end);
  process.exit(1);
}

// Read the replacement from adjacent file
const replacement = fs.readFileSync('preview-fn-replacement.js', 'utf8');
const result = src.slice(0, start) + replacement + '\n\n  ' + src.slice(end);
fs.writeFileSync('certificate-app.js', result, 'utf8');
console.log('Done. Injected preview function (' + replacement.length + ' chars)');
