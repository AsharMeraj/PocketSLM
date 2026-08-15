const fs = require("fs");
const path = require("path");

const source = path.resolve(__dirname, "./out");

const destination = path.resolve(
  __dirname,
  "../../Android/SLM_AI/app/src/main/assets"
);

if (!fs.existsSync(source)) {
  console.error("❌ Build folder not found:", source);
  console.error("Run `npm run build` first.");
  process.exit(1);
}

// 🧹 Clean destination first so stale build-id folders don't accumulate
if (fs.existsSync(destination)) {
  fs.rmSync(destination, { recursive: true, force: true });
}

fs.mkdirSync(destination, { recursive: true });

fs.cpSync(source, destination, {
  recursive: true,
  force: true,
});

console.log("========================================");
console.log("✅ Android build copied successfully!");
console.log("========================================");
console.log(`From: ${source}`);
console.log(`To:   ${destination}`);