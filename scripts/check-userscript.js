const fs = require("node:fs");
const { OUTPUT_FILE, buildUserscript } = require("./build-userscript");

const actual = fs.readFileSync(OUTPUT_FILE, "utf8");
const expected = buildUserscript();

if (actual !== expected) {
  console.error("LinuxDo Hub Tool.user.js is out of sync. Run: node scripts/build-userscript.js");
  process.exitCode = 1;
}
