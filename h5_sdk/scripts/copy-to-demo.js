import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const sdkRoot = path.resolve(scriptDirectory, '..');
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
