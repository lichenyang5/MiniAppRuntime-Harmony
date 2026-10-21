import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const demoDir = path.join(rootDir, 'examples', 'npm-har-consumer-demo', 'web');
const outputPath = path.join(rootDir, 'docs', 'examples', 'complete-react-app.md');
const writeMode = process.argv.includes('--write');

function read(relativePath) {
  return fs.readFileSync(path.join(demoDir, relativePath), 'utf8').trim();
}

function readRoot(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8').trim();
}

const documentText = `# 完整 React App

## 你将学会什么

复制一个覆盖环境检测、9 个公开 API、HTTP 状态、取消、结果与 DebugPanel 的完整 React 页面。

这份文档从仓库的公共包消费 Demo 生成。权威源码位于 \`examples/npm-har-consumer-demo/web/src/App.tsx\`，\`npm run check:docs-code\` 会同时检查文档同步和 TypeScript 类型。

## package.json 关键依赖

\`\`\`json
${read('package.json')}
\`\`\`

## vite.config.ts

\`base: './'\` 确保 ArkWeb rawfile 中的资源使用相对路径。

\`\`\`ts
${read('vite.config.ts')}
\`\`\`

## index.html

\`\`\`html
${read('index.html')}
\`\`\`

## tsconfig.json

\`\`\`json
${read('tsconfig.json')}
\`\`\`

## main.tsx

\`\`\`tsx
${read(path.join('src', 'main.tsx'))}
\`\`\`

## style.css

\`\`\`css
${read(path.join('src', 'style.css'))}
\`\`\`

## App.tsx

<!-- DOC-CHECK:complete-react-app -->
\`\`\`tsx
${read(path.join('src', 'App.tsx'))}
\`\`\`

## 构建脚本

\`scripts/inline-dist.mjs\`：

\`\`\`js
${read(path.join('scripts', 'inline-dist.mjs'))}
\`\`\`

\`scripts/sync-harmony.mjs\`：

\`\`\`js
${read(path.join('scripts', 'sync-harmony.mjs'))}
\`\`\`

## 构建并同步 rawfile

\`\`\`bash
cd examples/npm-har-consumer-demo/web
npm ci
npm run build:harmony
\`\`\`

构建脚本会把 Vite dist 同步到 \`harmony/entry/src/main/resources/rawfile/web/\`。示例中的公共 URL 仅用于演示，请在长期项目中替换为自己的可控服务。

## 下一步阅读

- [ArkWeb 接入](../guide/arkweb-integration.md)
- [Network API](../api/network.md)
- [调试](../guide/debugging.md)
`;

if (writeMode) {
  fs.writeFileSync(outputPath, documentText, 'utf8');
  console.log('[doc-examples] wrote docs/examples/complete-react-app.md');
  process.exit(0);
}

if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, 'utf8') !== documentText) {
  console.error('[doc-examples] complete React document is stale; run npm run docs:examples');
  process.exit(1);
}

const webPackage = JSON.parse(read('package.json'));
const sdkVersion = webPackage.dependencies?.['@lcy453/miniapp-runtime-harmony-web-sdk'];
if (sdkVersion !== '0.1.0') {
  console.error(`[doc-examples] expected public npm SDK 0.1.0, received ${sdkVersion ?? '<missing>'}`);
  process.exit(1);
}

const runtimeVersion = JSON.parse(readRoot('myascf_runtime/oh-package.json5')).version;
const harmonyPackage = JSON.parse(readRoot('examples/npm-har-consumer-demo/harmony/entry/oh-package.json5'));
const harmonyLock = JSON.parse(readRoot('examples/npm-har-consumer-demo/harmony/entry/oh-package-lock.json5'));
const lockedRuntime = harmonyLock.packages?.[`myascf_runtime@${runtimeVersion}`];
if (harmonyPackage.dependencies?.myascf_runtime !== runtimeVersion ||
  lockedRuntime?.version !== runtimeVersion || lockedRuntime?.registryType !== 'ohpm' ||
  lockedRuntime?.resolved !== `https://ohpm.openharmony.cn/ohpm/myascf_runtime/-/myascf_runtime-${runtimeVersion}.har` ||
  !lockedRuntime?.integrity?.startsWith('sha512-')) {
  console.error(`[doc-examples] independent HarmonyOS demo must pin public OHPM Runtime ${runtimeVersion}`);
  process.exit(1);
}
for (const file of ['README.md', 'docs/getting-started/quick-start.md',
  'docs/getting-started/react-quick-start.md', 'docs/guide/runtime-installation.md',
  'docs/guide/windows-initialization.md', 'docs/guide/extending-api.md',
  'examples/npm-har-consumer-demo/README.md']) {
  // The Windows guide retains a dated historical verification table.
  const content = file === 'docs/guide/windows-initialization.md'
    ? readRoot(file).split('## 实测环境和结果')[0] : readRoot(file);
  const versions = [...content.matchAll(/myascf_runtime@(\d+\.\d+\.\d+)|"myascf_runtime"\s*:\s*"(\d+\.\d+\.\d+)"/g)]
    .map(match => match[1] ?? match[2]);
  if (!versions.length || versions.some(version => version !== runtimeVersion)) {
    console.error(`[doc-examples] ${file} must document current Runtime ${runtimeVersion}`);
    process.exit(1);
  }
}

const npmCommand = process.platform === 'win32' ? process.execPath : 'npm';
const npmArgs = process.platform === 'win32'
  ? [path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js'), 'run', 'typecheck']
  : ['run', 'typecheck'];
const result = spawnSync(npmCommand, npmArgs, {
  cwd: demoDir,
  encoding: 'utf8',
  stdio: 'inherit'
});
if (result.error) {
  console.error(`[doc-examples] cannot run demo typecheck: ${result.error.message}`);
}
if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
console.log('[doc-examples] complete React document is current and type-safe');
console.log('[doc-examples] npm SDK and OHPM Runtime registry dependencies are pinned');
