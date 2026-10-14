import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const moduleDir = path.join(rootDir, 'myascf_runtime');
const metadataOnly = process.argv.includes('--metadata-only');
const harArgIndex = process.argv.indexOf('--har');

function fail(message) {
  console.error(`[har-release] ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch (error) { fail(`cannot read ${path.relative(rootDir, filePath)}: ${error.message}`); }
}

function collectNamedExports(content) {
  const exports = new Set();
  const exportPattern = /export\s+(?:type\s+)?\{([\s\S]*?)\}\s+from\s+["'][^"']+["']/g;
  let match;
  while ((match = exportPattern.exec(content)) !== null) {
    for (const item of match[1].split(',')) {
      const name = item.trim().replace(/^type\s+/, '').split(/\s+as\s+/i)[1] ||
        item.trim().replace(/^type\s+/, '').split(/\s+as\s+/i)[0];
      if (name) exports.add(name.trim());
    }
  }
  return exports;
}

const pkg = readJson(path.join(moduleDir, 'oh-package.json5'));
['name', 'version', 'description', 'main', 'license'].forEach((field) => {
  if (typeof pkg[field] !== 'string' || pkg[field].trim() === '') fail(`oh-package.json5 missing ${field}`);
});
if (!/^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/.test(pkg.name)) fail(`invalid package name: ${pkg.name}`);
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(pkg.version)) fail(`invalid package version: ${pkg.version}`);
const repositoryUrl =
  typeof pkg.repository === 'string'
    ? pkg.repository
    : pkg.repository?.url;

if (
  typeof repositoryUrl !== 'string' ||
  !/^(?:https?|ftp|rtsp|mms):\/\//i.test(repositoryUrl)
) {
  fail(
    'oh-package.json5 repository must be a valid URL starting with http, https, ftp, rtsp, or mms'
  );
}
if (!Array.isArray(pkg.keywords) || pkg.keywords.length === 0) fail('oh-package.json5 missing keywords');
if (!pkg.dependencies || typeof pkg.dependencies !== 'object' || Array.isArray(pkg.dependencies)) {
  fail('oh-package.json5 dependencies must be an object');
}

const mainPath = path.resolve(moduleDir, pkg.main);
if (!mainPath.startsWith(`${moduleDir}${path.sep}`) || !fs.existsSync(mainPath)) fail(`main entry does not exist: ${pkg.main}`);
const publicEntry = fs.readFileSync(path.join(moduleDir, 'src', 'main', 'ets', 'Index.ets'), 'utf8');
const forbiddenPublicExports = [
  'RuntimeLogger', 'BUILTIN_API_MANIFEST', 'ApiManifestItem',
  'BridgeDispatcher', 'HandlerRegistry', 'RuntimeBootstrap', 'BridgeController'
];
const requiredPublicExports = [
  'MyASCFRuntime', 'MyASCFNativeProxy', 'ApiSummary', 'BridgeResponse',
  'BridgeHandler', 'BridgeRequest', 'BridgeRequestParams', 'CustomApiMetadata',
  'BridgeResponseData', 'BridgeErrorCode', 'WebContainerConfig', 'WebUrlGuard',
  'WebLoadStatus', 'WebLoadState', 'NetworkMethod', 'NetworkPolicy',
  'NetworkResponseType'
];
const sourceExports = collectNamedExports(publicEntry);
for (const symbol of forbiddenPublicExports) {
  if (sourceExports.has(symbol)) fail(`internal symbol is exported from the public entry: ${symbol}`);
}
for (const symbol of requiredPublicExports) {
  if (!sourceExports.has(symbol)) fail(`required public symbol is missing from the source entry: ${symbol}`);
}
['README.md', 'CHANGELOG.md', 'LICENSE'].forEach((name) => {
  if (!fs.existsSync(path.join(moduleDir, name))) fail(`missing release file: myascf_runtime/${name}`);
});
const changelog = fs.readFileSync(path.join(moduleDir, 'CHANGELOG.md'), 'utf8');
if (!new RegExp(`^##\\s+${pkg.version.replace(/\./g, '\\.')}(?:\\s|$)`, 'm').test(changelog)) {
  fail(`myascf_runtime/CHANGELOG.md has no ${pkg.version} section`);
}

const forbiddenExtensions = /\.(?:p12|p7b|pfx|jks|keystore|cer|pem|key)$/i;
const sensitiveText = /(?:[A-Za-z]:[\\/]Users[\\/]|\/Users\/|\/home\/|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|(?:storePassword|keyPassword|_authToken|publish_id|key_path)\s*[=:]|--(?:publish_id|key_path)\s+(?!["']?<)[^\s]+)/i;
for (const scanRoot of [moduleDir, path.join(rootDir, 'examples', 'npm-har-consumer-demo')]) {
  if (!fs.existsSync(scanRoot)) continue;
  const stack = [scanRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (['node_modules', 'oh_modules', 'build', 'dist', '.hvigor', '.test'].includes(entry.name)) continue;
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) { stack.push(fullPath); continue; }
      if (forbiddenExtensions.test(entry.name)) fail(`sensitive file is not allowed: ${path.relative(rootDir, fullPath)}`);
      const buffer = fs.readFileSync(fullPath);
      if (!buffer.includes(0) && sensitiveText.test(buffer.toString('utf8'))) {
        fail(`sensitive or absolute path found: ${path.relative(rootDir, fullPath)}`);
      }
    }
  }
}

if (!metadataOnly) {
  let harPath;
  if (harArgIndex >= 0) {
    if (!process.argv[harArgIndex + 1]) fail('--har requires a file path');
    harPath = path.resolve(rootDir, process.argv[harArgIndex + 1]);
  } else {
    const buildDir = path.join(moduleDir, 'build');
    const candidates = [];
    if (fs.existsSync(buildDir)) {
      const stack = [buildDir];
      while (stack.length > 0) {
        const current = stack.pop();
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
          const fullPath = path.join(current, entry.name);
          if (entry.isDirectory()) stack.push(fullPath);
          else if (entry.name.endsWith('.har')) candidates.push(fullPath);
        }
      }
    }
    candidates.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
    harPath = candidates[0];
  }
  if (!harPath || !fs.existsSync(harPath)) fail('HAR file not found. Build it locally or pass --metadata-only in CI.');
  const stat = fs.statSync(harPath);
  if (!stat.isFile() || stat.size === 0) fail('HAR artifact is empty');
  if (path.extname(harPath).toLowerCase() !== '.har') fail('HAR artifact must use the .har extension');
  const signature = fs.readFileSync(harPath).subarray(0, 4).toString('hex');
  if (!signature.startsWith('504b') && !signature.startsWith('1f8b')) {
    fail('HAR artifact is not a supported ZIP or gzip archive');
  }

  let archiveEntries;
  let artifactPkg;
  try {
    archiveEntries = execFileSync('tar', ['-tf', harPath], { encoding: 'utf8' })
      .split(/\r?\n/).filter(Boolean);
    artifactPkg = JSON.parse(execFileSync('tar', ['-xOf', harPath, 'package/oh-package.json5'], { encoding: 'utf8' }));
  } catch (error) {
    fail(`cannot inspect HAR archive: ${error.message}`);
  }
  if (artifactPkg.name !== pkg.name || artifactPkg.version !== pkg.version || artifactPkg.license !== pkg.license) {
    fail(`HAR metadata does not match source package: expected ${pkg.name}@${pkg.version}`);
  }
  const artifactRepositoryUrl =
    typeof artifactPkg.repository === 'string'
      ? artifactPkg.repository
      : artifactPkg.repository?.url;

  if (artifactRepositoryUrl !== repositoryUrl) {
    fail(
      `HAR repository does not match source package: expected ${repositoryUrl}`
    );
  }
  if (artifactPkg.compatibleSdkVersion === undefined || artifactPkg.compatibleSdkType !== 'HarmonyOS') {
    fail('HAR compatibility metadata is incomplete');
  }
  if (artifactPkg.artifactType !== 'original') fail(`open-source release requires artifactType original, got: ${artifactPkg.artifactType}`);
  const publicArtifactEntry = `package/${artifactPkg.main || pkg.main}`;
  if (!archiveEntries.includes(publicArtifactEntry)) fail(`HAR public entry is missing: ${publicArtifactEntry}`);
  const apiExportEntry = 'package/src/main/ets/Index.ets';
  if (!archiveEntries.includes(apiExportEntry)) fail(`HAR API export entry is missing: ${apiExportEntry}`);
  for (const releaseFile of ['README.md', 'CHANGELOG.md', 'LICENSE']) {
    if (!archiveEntries.includes(`package/${releaseFile}`)) fail(`HAR release file is missing: package/${releaseFile}`);
  }
  const forbiddenArchivePath = /(?:^|\/)(?:node_modules|oh_modules|build|dist|\.hvigor|\.git)(?:\/|$)/i;
  const archiveSensitiveText = /(?:[A-Za-z]:[\\/]Users[\\/]|\/Users\/|\/home\/|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|(?:storePassword|keyPassword|_authToken|publish_id|key_path)\s*[=:]|--(?:publish_id|key_path)\s+(?!["']?<)[^\s]+)/i;
  for (const entry of archiveEntries) {
    if (forbiddenArchivePath.test(entry)) fail(`cache or build path found in HAR: ${entry}`);
    if (forbiddenExtensions.test(entry)) fail(`sensitive file found in HAR: ${entry}`);
    if (!/(?:\.(?:json5?|md|txt|d\.ets|d\.ts|ets|ts)|\/(?:\.ohpmrc|\.npmrc|\.env(?:\..+)?))$/i.test(entry)) continue;
    let content;
    try {
      content = execFileSync('tar', ['-xOf', harPath, entry], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    } catch (error) {
      fail(`cannot inspect HAR entry ${entry}: ${error.message}`);
    }
    if (archiveSensitiveText.test(content)) fail(`sensitive text found in HAR entry: ${entry}`);
  }
  const entryText = execFileSync('tar', ['-xOf', harPath, publicArtifactEntry], { encoding: 'utf8' });
  const declarationText = execFileSync('tar', ['-xOf', harPath, apiExportEntry], { encoding: 'utf8' });
  const artifactExports = collectNamedExports(declarationText);
  for (const symbol of forbiddenPublicExports) {
    if (artifactExports.has(symbol)) fail(`internal symbol found in HAR public declaration: ${symbol}`);
  }
  for (const symbol of requiredPublicExports) {
    if (!artifactExports.has(symbol)) fail(`required symbol missing from HAR public entry: ${symbol}`);
  }
  console.log(`[har-release] HAR: ${path.relative(rootDir, harPath)} (${stat.size} bytes)`);
  console.log(`[har-release] archive metadata: ${artifactPkg.name}@${artifactPkg.version}, entry ${publicArtifactEntry}, artifactType ${artifactPkg.artifactType}`);
}

console.log(`[har-release] metadata OK: ${pkg.name}@${pkg.version}`);
console.log(`[har-release] mode: ${metadataOnly ? 'metadata-only' : 'local artifact'}`);
