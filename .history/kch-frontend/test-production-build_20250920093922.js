#!/usr/bin/env node
// Test script to verify production build works correctly

console.log("🔧 Testing production build...");

const fs = require("fs");
const path = require("path");

// Check if build directory exists
const buildDir = path.join(__dirname, "dist");
if (!fs.existsSync(buildDir)) {
  console.error('❌ Build directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Check for critical files
const criticalFiles = ["index.html", "assets"];

let allFilesExist = true;
criticalFiles.forEach((file) => {
  const filePath = path.join(buildDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Critical file missing: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Found: ${file}`);
  }
});

// Check if Service Worker exists
const swPath = path.join(__dirname, "public", "sw.js");
if (fs.existsSync(swPath)) {
  console.log("✅ Service Worker found: sw.js");
} else {
  console.warn("⚠️ Service Worker not found: sw.js");
}

// Check for our fixed components in the source
const hookPath = path.join(__dirname, "src", "hooks", "useConnectionStatus.js");
if (fs.existsSync(hookPath)) {
  const hookContent = fs.readFileSync(hookPath, "utf8");
  if (hookContent.includes("isSlowConnection: isSlowConnection(),")) {
    console.log("✅ useConnectionStatus hook fix is present");
  } else {
    console.error("❌ useConnectionStatus hook fix is missing");
    allFilesExist = false;
  }
} else {
  console.error("❌ useConnectionStatus hook file not found");
  allFilesExist = false;
}

if (allFilesExist) {
  console.log("\n🎉 Production build appears to be ready!");
  console.log("📦 Next steps:");
  console.log("   1. Deploy the dist/ folder to your hosting platform");
  console.log("   2. Clear browser cache after deployment");
  console.log("   3. Test the production site for errors");
} else {
  console.log("\n❌ Production build has issues. Please fix before deploying.");
  process.exit(1);
}
