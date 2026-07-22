import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(scriptDir, '..', 'dist');
const targetDir = path.resolve(
  scriptDir,
  '..',
  '..',
  'harmony',
  'entry',
  'src',
  'main',
  'resources',
  'rawfile',
  'web'
);

const sourceIndex = path.join(sourceDir, 'index.html');
if (!fs.existsSync(sourceIndex)) {
  throw new Error('web_app/dist/index.html is missing. Run npm run build first.');
}

const expectedTargetSuffix = path.join('harmony', 'entry', 'src', 'main', 'resources', 'rawfile', 'web');
if (!targetDir.endsWith(expectedTargetSuffix)) {
  throw new Error(`Refusing to sync to unexpected target: ${targetDir}`);
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });

const copiedFiles = fs.readdirSync(targetDir, { recursive: true });
console.log(`[H5 SDK] copied ${copiedFiles.length} build entries from dist`);
console.log(`[H5 SDK] HarmonyOS rawfile target: ${targetDir}`);
