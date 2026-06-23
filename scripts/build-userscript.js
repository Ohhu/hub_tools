const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_FILE = path.join(ROOT, "LinuxDo Hub Tool.user.js");

const SOURCE_FILES = [
  "src/core/state-and-queries.js",
  "src/core/fetch-patch.js",
  "src/marketplace/pricing.js",
  "src/dom/mount-and-marketplace-ui.js",
  "src/core/channel-cache.js",
  "src/api-keys/dialog-ui.js",
  "src/api-keys/operations.js",
  "src/core/bootstrap-and-test-exports.js",
];

function readSource(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8").trimEnd();
}

function buildUserscript() {
  const header = readSource("src/userscript-header.js");
  const body = SOURCE_FILES.map(readSource).join("\n\n");
  return `${header}\n\n(function () {\n  "use strict";\n\n${body}\n})();\n`;
}

if (require.main === module) {
  fs.writeFileSync(OUTPUT_FILE, buildUserscript());
}

module.exports = {
  OUTPUT_FILE,
  buildUserscript,
};
