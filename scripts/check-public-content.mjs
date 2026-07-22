import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scanTargets = [
  'docs',
  'examples/npm-har-consumer-demo',
  'scripts',
  'README.md',
  'RELEASE.md',
  'CHANGELOG.md'
];
const ignored = new Set(['node_modules', 'oh_modules', 'build', 'dist', '.hvigor', '.git']);
const sensitiveExtension = /\.(?:p12|pfx|jks|keystore|cer|pem|key)$/i;
const prohibitedText = [
  { name: 'absolute user path', pattern: /(?:[A-Za-z]:[\\/]Users[\\/]|\/Users\/|\/home\/)/i },
  { name: 'private key', pattern: /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/i },
  { name: 'embedded password field', pattern: /(?:storePassword|keyPassword)\s*[=:]\s*["'][^"']+/i },
  { name: 'forbidden positioning', pattern: /(?:复刻 ASCF|仿 ASCF|华为内部框架|官方替代方案|完全兼容某闭源框架)/i }
];
const failures = [];

function scan(fullPath) {
  const stat = fs.statSync(fullPath);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(fullPath, { withFileTypes: true })) {
      if (!ignored.has(entry.name)) scan(path.join(fullPath, entry.name));
    }
    return;
  }
  if (sensitiveExtension.test(fullPath)) {
    failures.push(`${path.relative(rootDir, fullPath)}: sensitive file extension`);
    return;
  }
  if (fullPath === fileURLToPath(import.meta.url)) return;
  const buffer = fs.readFileSync(fullPath);
  if (buffer.includes(0)) return;
  const content = buffer.toString('utf8');
  prohibitedText.forEach(({ name, pattern }) => {
    if (pattern.test(content)) failures.push(`${path.relative(rootDir, fullPath)}: ${name}`);
  });
}

scanTargets.forEach((relative) => {
  const fullPath = path.join(rootDir, relative);
  if (fs.existsSync(fullPath)) scan(fullPath);
});

if (failures.length > 0) {
  failures.forEach((failure) => console.error(`[public-content] ${failure}`));
  process.exit(1);
}
console.log('[public-content] OK: release docs, scripts and consumer demo are sanitized');
const rootBuildProfile = path.join(rootDir, 'build-profile.json5');
if (fs.existsSync(rootBuildProfile)) {
  const rootProfileText = fs.readFileSync(rootBuildProfile, 'utf8');
  if (/signingConfigs|storePassword|keyPassword|[A-Za-z]:[\\/]Users[\\/]/i.test(rootProfileText)) {
    console.warn('[public-content] RELEASE BLOCKER: root build-profile.json5 still contains local signing configuration; rotate credentials and clean tracked history before release.');
  }
}
