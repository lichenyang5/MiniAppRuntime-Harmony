import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.resolve(scriptDir, '..', 'dist');
const targetDir = path.resolve(
  scriptDir,
  '..',
  '..',
  'harmony_app',
  'entry',
  'src',
  'main',
  'resources',
  'rawfile',
  'web'
);

if (!fs.existsSync(path.join(sourceDir, 'index.html'))) {
  throw new Error('web_app/dist is missing. Run npm run build first.');
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });
console.log(`[consumer-demo] copied ${sourceDir}`);
console.log(`[consumer-demo] to ${targetDir}`);
