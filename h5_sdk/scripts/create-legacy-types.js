import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(scriptDirectory, '..', 'dist');
const indexTypes = path.join(distDirectory, 'index.d.ts');

if (!fs.existsSync(indexTypes)) {
  throw new Error('dist/index.d.ts is missing. Run the declaration build first.');
}

fs.writeFileSync(
  path.join(distDirectory, 'myascf.d.ts'),
  "import './bridge-types.js';\nexport {};\n",
  'utf8'
);
