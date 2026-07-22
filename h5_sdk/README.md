# @lcy453/miniapp-runtime-harmony-web-sdk

这篇文档解决什么问题：说明 MiniAppRuntime-Harmony H5 SDK 的安装方式、公开入口、ArkWeb 边界、构建测试和首次发布状态。

该包是一个受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架的 H5 侧 SDK。它负责 requestId、callback map、Promise、timeout、AbortSignal、Native 消息发送和类型化 API，不包含 ArkTS Runtime 或 Native 业务实现。

## 安装

发布后从 npm registry 安装：

```bash
npm install @lcy453/miniapp-runtime-harmony-web-sdk
```

当前包处于首次发布前人工确认阶段。registry 回读完成前，不将上述命令描述为已验证可用。

## ESM

```ts
import {
  initMyASCF,
  createTypedApi
} from '@lcy453/miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);

await api.ui.showToast({ message: 'Hello from npm SDK' });
```

根入口是无自动挂载副作用的 ESM。`createMyASCF()` 只创建 client；`initMyASCF()` 会挂载 `window.myascf` 并注册 Native response callback。

## IIFE

IIFE 产物位于 `dist/myascf.js`，加载后会自动执行 `initMyASCF()`：

```html
<script src="./myascf.js"></script>
<script>
  window.myascf.send('ui.showToast', { message: 'hello' });
</script>
```

npm 子路径为 `@lcy453/miniapp-runtime-harmony-web-sdk/iife`。该入口具有自动初始化副作用，因此 package.json 只把 IIFE 标记为 `sideEffects`。

## Typed API

```ts
const storage = await api.system.storage.getItem({ key: 'username' });
console.log(storage.data?.value);

const network = await api.network.request({
  url: 'https://example.com',
  method: 'GET',
  responseType: 'text',
  timeout: 10000
}, { timeout: 12000 });

console.log(network.data?.statusCode, network.data?.ok);
```

HTTP 4xx/5xx 仍表示 Bridge 已拿到有效 HTTP 响应，因此 Promise resolve；使用 `data.ok` 判断是否为 2xx。

## AbortSignal

```ts
const controller = new AbortController();
const task = api.network.request({
  url: 'https://example.com/slow'
}, {
  signal: controller.signal,
  timeout: 12000
});

controller.abort();
await task; // rejects AbortError with code ABORTED
```

SDK 会释放 callback、timer 和 abort listener。对 `network.request`，还会通过 internal `network.abort` 请求 Runtime 使用公开 `HttpRequest.destroy()` 做 best-effort 终止。

## ArkWeb 边界

```text
H5 SDK
-> window.MyASCFNative.postMessage
-> local myascf_runtime HAR
-> window.__myascf_on_native_response__
-> Promise resolve / reject
```

普通浏览器没有 `window.MyASCFNative`，调用会 reject `NATIVE_UNAVAILABLE`。这是可预期边界，不是页面崩溃。

## 公开产物

```text
dist/index.esm.js    ESM root entry
dist/index.d.ts      TypeScript declarations
dist/myascf.js       IIFE auto-init bundle
dist/myascf.d.ts     IIFE type entry
```

包中只包含 `dist`、README、LICENSE、CHANGELOG 和 package.json，不包含源码、测试、脚本、node_modules 或 HarmonyOS 签名材料。

## 本地开发

```bash
npm install
npm run build
npm test
npm run check
npm pack --dry-run
npm pack
```

当前测试覆盖 ESM/IIFE、requestId、callback、timeout、invalid response、typed API、HTTP 状态语义、AbortController、并发取消、迟到响应和 DebugPanel 脱敏。

## 当前发布状态

- 包名：`@lcy453/miniapp-runtime-harmony-web-sdk`
- 版本：`0.1.0`
- registry：`https://registry.npmjs.org/`
- package 配置：`private: false`、`publishConfig.access = public`
- npm registry consumer：已验证
- npm publish：`0.1.0` 已发布
- ArkTS Runtime：继续通过本地 HAR/GitHub 源码接入，不随 npm 包发布

项目用于开源学习和工程实践，不宣称达到生产级 SDK 的安全、兼容性或设备覆盖要求。
