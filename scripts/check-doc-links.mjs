import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const roots = ['.'];
const topFiles = [];
const markdownFiles = [];

function collect(current) {
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    if (['node_modules', 'oh_modules', 'build', 'dist', '.hvigor', '.git'].includes(entry.name)) continue;
    const fullPath = path.join(current, entry.name);
    if (entry.isDirectory()) collect(fullPath);
    else if (entry.name.endsWith('.md')) markdownFiles.push(fullPath);
  }
}

roots.forEach((relative) => {
  const target = path.join(rootDir, relative);
  if (fs.existsSync(target)) collect(target);
});
topFiles.forEach((relative) => markdownFiles.push(path.join(rootDir, relative)));

const failures = [];
for (const filePath of markdownFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
  for (const match of content.matchAll(linkPattern)) {
    let target = match[1].trim().replace(/^<|>$/g, '');
    if (!target || /^(?:https?:|mailto:|#|data:)/i.test(target)) continue;
    target = target.split('#')[0].split('?')[0];
    if (!target) continue;
    const resolved = path.resolve(path.dirname(filePath), decodeURIComponent(target));
    if (!fs.existsSync(resolved)) {
      failures.push(`${path.relative(rootDir, filePath)} -> ${target}`);
    }
  }
}

if (failures.length > 0) {
  failures.forEach((failure) => console.error(`[doc-links] missing: ${failure}`));
  process.exit(1);
}
console.log(`[doc-links] OK: ${markdownFiles.length} Markdown files checked`);
