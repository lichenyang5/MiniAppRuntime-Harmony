'use strict';

const fs = require('fs');
const path = require('path');

const sdkRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(sdkRoot, '..');
const sourcePath = path.join(sdkRoot, 'dist', 'myascf.js');
const targetPath = path.join(
  projectRoot,
  'entry',
  'src',
  'main',
  'resources',
  'rawfile',
  'web',
  'js',
  'myascf.js'
);

if (!fs.existsSync(sourcePath)) {
  console.error('[h5-sdk] dist/myascf.js is missing. Run npm run build first.');
  process.exit(1);
}

fs.copyFileSync(sourcePath, targetPath);
console.log(`[h5-sdk] copied ${path.relative(projectRoot, sourcePath)}`);
console.log(`[h5-sdk] to ${path.relative(projectRoot, targetPath)}`);
