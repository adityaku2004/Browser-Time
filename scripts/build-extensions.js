import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const chromeDir = path.join(rootDir, 'chrome-dist');
const firefoxDir = path.join(rootDir, 'firefox-dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run vite build first.');
  process.exit(1);
}

// Helper to recursively copy directory
function copyDirSync(src, dest) {
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Generating browser extension distributions...');

// 1. Generate chrome-dist
copyDirSync(distDir, chromeDir);
const chromeFirefoxManifest = path.join(chromeDir, 'manifest.firefox.json');
if (fs.existsSync(chromeFirefoxManifest)) {
  fs.unlinkSync(chromeFirefoxManifest);
}
console.log('  ✓ chrome-dist generated (Ready for Chrome, Edge, Brave, Arc)');

// 2. Generate firefox-dist
copyDirSync(distDir, firefoxDir);
const firefoxCustomManifest = path.join(firefoxDir, 'manifest.firefox.json');
const firefoxManifestTarget = path.join(firefoxDir, 'manifest.json');
if (fs.existsSync(firefoxCustomManifest)) {
  fs.copyFileSync(firefoxCustomManifest, firefoxManifestTarget);
  fs.unlinkSync(firefoxCustomManifest);
}
console.log('  ✓ firefox-dist generated (Ready for Firefox via about:debugging or web-ext)');

console.log('\nDistributions successfully generated:');
console.log('  • chrome-dist/  -> chrome://extensions (Load unpacked)');
console.log('  • firefox-dist/ -> about:debugging (Load Temporary Add-on)');
