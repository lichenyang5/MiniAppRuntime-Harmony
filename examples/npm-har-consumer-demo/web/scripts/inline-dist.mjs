import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(scriptDir, '..', 'dist');
const htmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(htmlPath)) {
  throw new Error('web/dist/index.html is missing. Run vite build first.');
}

let html = fs.readFileSync(htmlPath, 'utf8');
const scriptMatch = html.match(/<script\b[^>]*type="module"[^>]*src="([^"]+)"[^>]*><\/script>/);
const styleMatch = html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);

if (!scriptMatch || !styleMatch) {
  throw new Error('Expected one Vite module script and stylesheet in dist/index.html.');
}

function resolveDistAsset(assetUrl) {
  const relativePath = assetUrl.replace(/^\.\//, '');
  const assetPath = path.resolve(distDir, relativePath);
  if (!assetPath.startsWith(`${distDir}${path.sep}`) || !fs.existsSync(assetPath)) {
    throw new Error(`Invalid or missing Vite asset: ${assetUrl}`);
  }
  return assetPath;
}

const scriptText = fs.readFileSync(resolveDistAsset(scriptMatch[1]), 'utf8')
  // HTML parsers close inline scripts at this token even when it appears in a JS string.
  .replace(/<\/script/gi, '<\\/script');
const styleText = fs.readFileSync(resolveDistAsset(styleMatch[1]), 'utf8')
  .replace(/<\/style/gi, '<\\/style');

html = html
  .replace(styleMatch[0], () => `<style>\n${styleText}\n</style>`)
  .replace(scriptMatch[0], '')
  .replace('</body>', () => `<script type="module">\n${scriptText}\n</script>\n</body>`)
  .replace(/[ \t]+$/gm, '');

if (/\bassets\//.test(html)) {
  throw new Error('Vite asset references remain after inlining. Refusing to delete dist/assets.');
}

fs.writeFileSync(htmlPath, html, 'utf8');
fs.rmSync(path.join(distDir, 'assets'), { recursive: true, force: true });

console.log('[H5 SDK] inlined Vite JavaScript and CSS into dist/index.html');
