# 完整 React App

## 你将学会什么

复制一个覆盖环境检测、9 个公开 API、HTTP 状态、取消、结果与 DebugPanel 的完整 React 页面。

这份文档从仓库的公共包消费 Demo 生成。权威源码位于 `examples/npm-har-consumer-demo/web/src/App.tsx`，`npm run check:docs-code` 会同时检查文档同步和 TypeScript 类型。

## package.json 关键依赖

```json
{
  "name": "miniapp-runtime-npm-har-consumer-web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --noEmit",
    "build": "npm run typecheck && vite build && node scripts/inline-dist.mjs",
    "sync:harmony": "node scripts/sync-harmony.mjs",
    "build:harmony": "npm run build && npm run sync:harmony",
    "build:harmony-web": "npm run build:harmony"
  },
  "dependencies": {
    "@lcy453/miniapp-runtime-harmony-web-sdk": "0.1.0",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  },
  "devDependencies": {
    "@types/react": "19.1.8",
    "@types/react-dom": "19.1.6",
    "@vitejs/plugin-react": "4.6.0",
    "typescript": "5.7.2",
    "vite": "6.4.5"
  }
}
```

## vite.config.ts

`base: './'` 确保 ArkWeb rawfile 中的资源使用相对路径。

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2017',
    outDir: 'dist',
    emptyOutDir: true
  }
});
```

## index.html

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>MyASCF Full Chain Demo</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2017", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src", "vite.config.ts"]
}
```

## main.tsx

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## style.css

```css
:root {
  font-family: Inter, system-ui, sans-serif;
  color: #18212f;
  background: #edf1f5;
  font-synthesis: none;
}

* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; }
button { font: inherit; }
.app-shell { width: min(920px, 100%); margin: 0 auto; padding: 24px 16px 48px; }
.app-header { border-left: 4px solid #087f5b; padding-left: 16px; }
.eyebrow { margin: 0; color: #9c4f16; font-size: 13px; font-weight: 700; text-transform: uppercase; }
h1 { margin: 6px 0 14px; font-size: 30px; letter-spacing: 0; }
h2 { margin: 0; font-size: 17px; letter-spacing: 0; }
.environment { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 16px; margin: 0; }
.environment div { display: flex; justify-content: space-between; gap: 8px; border-bottom: 1px solid #cbd3da; padding: 5px 0; }
.environment dt { color: #536170; }
.environment dd { margin: 0; font-family: ui-monospace, monospace; font-weight: 700; }
.actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin: 24px 0; }
.actions button { min-height: 46px; border: 1px solid #aeb9c4; border-radius: 6px; background: #fff; color: #18212f; cursor: pointer; }
.actions button:active { border-color: #087f5b; background: #e9f8f2; }
.result-panel, .debug-panel { border-top: 1px solid #c8d0d8; padding: 18px 0; }
.section-heading { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.section-heading strong { color: #087f5b; font-size: 13px; }
.section-heading span { color: #687584; font-size: 13px; }
.result-summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 16px; margin: 14px 0; }
.result-summary div { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 8px; border-bottom: 1px solid #d7dde3; padding: 6px 0; }
.result-summary dt { color: #536170; }
.result-summary dd { margin: 0; overflow-wrap: anywhere; font-family: ui-monospace, monospace; }
.http-note { color: #536170; font-size: 13px; line-height: 1.6; }
pre { min-height: 150px; overflow: auto; padding: 14px; border-radius: 6px; background: #17212b; color: #f8fafc; white-space: pre-wrap; overflow-wrap: anywhere; }
.debug-records { display: grid; gap: 8px; margin-top: 12px; }
.debug-records article { display: grid; grid-template-columns: 90px 1fr; gap: 4px 12px; padding: 10px 12px; border-left: 3px solid #d08c25; background: #fff; }
.debug-records code { grid-column: 1 / -1; color: #687584; overflow-wrap: anywhere; }

@media (max-width: 520px) {
  .environment, .actions, .result-summary { grid-template-columns: 1fr; }
  h1 { font-size: 26px; }
}
```

## App.tsx

<!-- DOC-CHECK:complete-react-app -->
```tsx
import { useMemo, useRef, useState } from 'react';
import {
  createTypedApi,
  initMyASCF,
  type DebugRecord
} from '@lcy453/miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);

interface ResultSummary {
  action: string;
  bridge: 'RESOLVED' | 'REJECTED';
  requestId: string;
  code: string;
  message: string;
  duration: string;
  httpStatus: string;
  httpOk: string;
  errorKind: string;
}

function serialize(value: unknown): string {
  if (value instanceof Error) {
    return JSON.stringify({ name: value.name, message: value.message }, null, 2);
  }
  return JSON.stringify(value, null, 2) ?? String(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readEnvironment(): Record<string, string> {
  return {
    myascfType: typeof window.myascf,
    nativeType: typeof window.MyASCFNative,
    postMessageType: typeof window.MyASCFNative?.postMessage,
    callbackType: typeof window.__myascf_on_native_response__
  };
}

function summarize(action: string, bridge: 'RESOLVED' | 'REJECTED', value: unknown): ResultSummary {
  const response: Record<string, unknown> = isRecord(value) ? value : {};
  const data: Record<string, unknown> = isRecord(response.data) ? response.data : {};
  const message: string = typeof response.message === 'string' ? response.message : '';
  const code: string = response.code === undefined ? '-' : String(response.code);
  const knownErrors: string[] = [
    'NATIVE_UNAVAILABLE',
    'TIMEOUT',
    'CALLBACK_LOST',
    'INVALID_RESPONSE',
    'UNKNOWN_ACTION',
    'PARAM_ERROR',
    'NETWORK_TIMEOUT',
    'NETWORK_REQUEST_FAILED'
  ];
  const errorKind: string = bridge === 'RESOLVED'
    ? '-'
    : knownErrors.find((name: string) => message.includes(name)) ?? 'BUSINESS_OR_BRIDGE_ERROR';

  return {
    action,
    bridge,
    requestId: typeof response.requestId === 'string' ? response.requestId : '-',
    code,
    message: message || '-',
    duration: response.duration === undefined ? '-' : `${String(response.duration)} ms`,
    httpStatus: data.statusCode === undefined ? '-' : String(data.statusCode),
    httpOk: data.ok === undefined ? '-' : String(data.ok),
    errorKind
  };
}

export function App() {
  const [status, setStatus] = useState('Ready');
  const [result, setResult] = useState('No request yet.');
  const [summary, setSummary] = useState<ResultSummary | null>(null);
  const [records, setRecords] = useState<DebugRecord[]>([]);
  const activeController = useRef<AbortController | null>(null);
  const environment = useMemo(readEnvironment, []);

  const recordDebug = (record: DebugRecord): void => {
    setRecords((current) => {
      const next = current.filter((item) => item.requestId !== record.requestId);
      return [record, ...next].slice(0, 30);
    });
  };

  window.MyASCFDebugPanel = {
    recordStart: recordDebug,
    recordEnd: recordDebug,
    recordError: recordDebug,
    recordLost: recordDebug,
    recordAbort: recordDebug,
    recordLateAfterAbort: recordDebug
  };

  const run = async (label: string, task: () => Promise<unknown>): Promise<void> => {
    setStatus(`${label}: pending`);
    try {
      const response: unknown = await task();
      setStatus(`${label}: resolved`);
      setResult(serialize(response));
      setSummary(summarize(label, 'RESOLVED', response));
    } catch (error: unknown) {
      setStatus(`${label}: rejected`);
      setResult(serialize(error));
      setSummary(summarize(label, 'REJECTED', error));
    }
  };

  const startAbortDemo = (): void => {
    const controller = new AbortController();
    activeController.current = controller;
    void (async (): Promise<void> => {
      try {
        await run('network.request (abort)', () => api.network.request({
          url: 'https://httpbin.org/delay/10',
          method: 'GET',
          responseType: 'json',
          timeout: 15000
        }, {
          timeout: 17000,
          signal: controller.signal
        }));
      } finally {
        if (activeController.current === controller) {
          activeController.current = null;
        }
      }
    })();
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">HarmonyOS ArkWeb Integration</p>
        <h1>npm SDK + OHPM Runtime</h1>
        <dl className="environment">
          {Object.entries(environment).map(([key, value]) => (
            <div key={key}><dt>{key}</dt><dd>{value}</dd></div>
          ))}
        </dl>
      </header>

      <section className="actions" aria-label="Runtime API actions">
        <button type="button" onClick={() => void run('ui.showToast', () => api.ui.showToast({ message: 'Hello from npm SDK + OHPM Runtime' }))}>Show Toast</button>
        <button type="button" onClick={() => void run('runtime.getApiList', () => api.runtime.getApiList())}>Runtime API List</button>
        <button type="button" onClick={() => void run('system.storage.setItem', () => api.system.storage.setItem({ key: 'full-chain-demo', value: 'stored-by-har' }))}>Storage Set</button>
        <button type="button" onClick={() => void run('system.storage.getItem', () => api.system.storage.getItem({ key: 'full-chain-demo' }))}>Storage Get</button>
        <button type="button" onClick={() => void run('system.storage.removeItem', () => api.system.storage.removeItem({ key: 'full-chain-demo' }))}>Storage Remove</button>
        <button type="button" onClick={() => void run('system.storage.clear', () => api.system.storage.clear())}>Storage Clear</button>
        <button type="button" onClick={() => void run('system.clipboard.writeText', () => api.system.clipboard.writeText({ text: 'Hello from npm SDK + OHPM Runtime' }))}>Clipboard Write</button>
        <button type="button" onClick={() => void run('system.clipboard.readText', () => api.system.clipboard.readText())}>Clipboard Read</button>
        <button type="button" onClick={() => void run('network.request', () => api.network.request({ url: 'https://example.com', method: 'GET', responseType: 'text', timeout: 10000 }, { timeout: 12000 }))}>Network GET</button>
        <button type="button" onClick={() => void run('network.request (POST)', () => api.network.request({ url: 'https://httpbin.org/post', method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ source: 'MiniAppRuntime-Harmony' }), responseType: 'json', timeout: 10000 }, { timeout: 12000 }))}>Network POST</button>
        <button type="button" onClick={() => void run('network.request (non-2xx)', () => api.network.request({ url: 'https://example.com/not-found', method: 'GET', responseType: 'text', timeout: 10000 }, { timeout: 12000 }))}>Network non-2xx</button>
        <button type="button" onClick={startAbortDemo}>Start cancellable request</button>
        <button type="button" onClick={() => activeController.current?.abort()}>Abort request</button>
      </section>

      <section className="result-panel" aria-live="polite">
        <div className="section-heading"><h2>Latest result</h2><strong>{status}</strong></div>
        {summary && (
          <dl className="result-summary">
            {Object.entries(summary).map(([key, value]) => (
              <div key={key}><dt>{key}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        )}
        <pre>{result}</pre>
        <p className="http-note">Bridge 成功不等于 HTTP 2xx。HTTP 404/500 会 resolve，并通过 data.ok=false 交给 H5 判断。</p>
      </section>

      <section className="debug-panel">
        <div className="section-heading"><h2>Bridge timeline</h2><span>{records.length} records</span></div>
        <div className="debug-records">
          {records.map((record) => (
            <article key={record.requestId}>
              <strong>{record.status}</strong>
              <span>{record.action}</span>
              <code>{record.requestId}</code>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
```

## 构建脚本

`scripts/inline-dist.mjs`：

```js
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
```

`scripts/sync-harmony.mjs`：

```js
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
```

## 构建并同步 rawfile

```bash
cd examples/npm-har-consumer-demo/web
npm ci
npm run build:harmony
```

构建脚本会把 Vite dist 同步到 `harmony/entry/src/main/resources/rawfile/web/`。示例中的公共 URL 仅用于演示，请在长期项目中替换为自己的可控服务。

## 下一步阅读

- [ArkWeb 接入](../guide/arkweb-integration.md)
- [Network API](../api/network.md)
- [调试](../guide/debugging.md)
