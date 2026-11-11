const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- Arena Auctions: Building Frontend for Vercel ---');
const clientDir = path.join(__dirname, '..', 'client');
const clientDist = path.join(clientDir, 'dist');
const rootDist = path.join(__dirname, '..', 'dist');

console.log('1. Installing client dependencies...');
execSync('npm install', { cwd: clientDir, stdio: 'inherit' });

console.log('2. Running Vite production build...');
execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });

console.log('3. Mirroring client/dist to root dist directory...');
if (fs.existsSync(clientDist)) {
  if (fs.existsSync(rootDist)) {
    fs.rmSync(rootDist, { recursive: true, force: true });
  }
  fs.cpSync(clientDist, rootDist, { recursive: true });
  console.log('✓ Successfully created root dist/ directory for Vercel deployment!');
} else {
  console.error('✗ Build failed: client/dist not found!');
  process.exit(1);
}
