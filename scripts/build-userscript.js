const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_FILE = path.join(ROOT, "LinuxDo Hub Tool.user.js");

// Source order is the module boundary for this zero-dependency userscript build.
// Keep foundational constants/state/helpers before feature modules, and keep
// bootstrap/test exports last so all runtime helpers are available.
const SOURCE_FILES = [
  "src/base.js",
  "src/graphql.js",
  "src/marketplace-pricing.js",
  "src/marketplace-payload.js",
  "src/fetch-patch.js",
  "src/channel-cache.js",
  "src/page-integration.js",
  "src/api-keys.js",
  "src/bootstrap-and-test-exports.js",
];

function assertValidSourceFiles() {
  const seen = new Set();
  const duplicates = [];
  const missing = [];

  for (const file of SOURCE_FILES) {
    if (seen.has(file)) duplicates.push(file);
    seen.add(file);

    if (!fs.existsSync(path.join(ROOT, file))) missing.push(file);
  }

  const unlisted = listJavaScriptFiles(path.join(ROOT, "src"))
    .filter((file) => file !== "src/userscript-header.js" && !seen.has(file));

  if (duplicates.length || missing.length || unlisted.length) {
    const details = [];
    if (duplicates.length) details.push(`duplicate source files: ${duplicates.join(", ")}`);
    if (missing.length) details.push(`missing source files: ${missing.join(", ")}`);
    if (unlisted.length) details.push(`source files missing from SOURCE_FILES: ${unlisted.join(", ")}`);
    throw new Error(`Invalid userscript build source list (${details.join("; ")})`);
  }

  assertSourceOrder("src/base.js", "src/graphql.js");
  assertSourceOrder("src/marketplace-pricing.js", "src/fetch-patch.js");
  assertSourceOrder("src/marketplace-payload.js", "src/fetch-patch.js");
  assertSourceOrder("src/channel-cache.js", "src/page-integration.js");
  assertLastSourceFile("src/bootstrap-and-test-exports.js");
}

function listJavaScriptFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...listJavaScriptFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(path.relative(ROOT, entryPath).split(path.sep).join("/"));
    }
  }
  return files.sort();
}

function assertSourceOrder(before, after) {
  const beforeIndex = SOURCE_FILES.indexOf(before);
  const afterIndex = SOURCE_FILES.indexOf(after);
  if (beforeIndex < 0 || afterIndex < 0 || beforeIndex >= afterIndex) {
    throw new Error(`Invalid userscript build source order (${before} must come before ${after})`);
  }
}

function assertLastSourceFile(file) {
  if (SOURCE_FILES.at(-1) !== file) {
    throw new Error(`Invalid userscript build source order (${file} must be last)`);
  }
}

function readSource(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8").trimEnd();
}

function buildUserscript() {
  assertValidSourceFiles();
  const header = readSource("src/userscript-header.js");
  const body = SOURCE_FILES.map(readSource).join("\n\n");
  return `${header}\n\n(function () {\n  "use strict";\n\n${body}\n})();\n`;
}

if (require.main === module) {
  fs.writeFileSync(OUTPUT_FILE, buildUserscript());
}

module.exports = {
  OUTPUT_FILE,
  SOURCE_FILES,
  assertLastSourceFile,
  assertSourceOrder,
  assertValidSourceFiles,
  buildUserscript,
};
