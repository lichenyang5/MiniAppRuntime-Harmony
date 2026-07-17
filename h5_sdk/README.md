# miniapp-runtime-harmony-web-sdk

这篇文档解决什么问题：说明 H5 SDK 的职责、IIFE 与 ESM 两种接入方式、构建流程和当前发布边界。

`miniapp-runtime-harmony-web-sdk` 是 MiniAppRuntime-Harmony 的浏览器侧 JSBridge SDK。它负责 `requestId`、callback map、timeout、Native 调用与 Promise 回调，不包含 Toast、Clipboard、Storage 等 Native 业务实现。

## 安装与构建

```bash
npm install
npm run build
npm test
```

构建产物：

```text
dist/myascf.js       IIFE，全局脚本并自动挂载 window.myascf
dist/index.esm.js    ESM，无导入副作用
dist/index.d.ts      ESM TypeScript 类型入口
dist/myascf.d.ts     IIFE 兼容类型入口
```

构建使用 `esbuild` 生成两个 JavaScript bundle，使用 `tsc` 检查源码并生成声明文件。

## IIFE Script

适用于 HarmonyOS ArkWeb rawfile、简单 H5 页面和不使用前端构建工具的场景。

```html
<script src="./js/myascf.js"></script>
<script>
  window.myascf.send('ui.showToast', { message: 'hello' });
</script>
```

加载 `dist/myascf.js` 后会自动执行 `initMyASCF()`，挂载：

```text
window.myascf
window.__myascf_on_native_response__
```

同步到 ArkWeb Demo：

```bash
npm run build:demo
```

脚本只复制 IIFE 产物到 `entry/src/main/resources/rawfile/web/js/myascf.js`，不会把 ESM 复制到 rawfile。

## ESM Import

适用于 TypeScript、Vite、Webpack、Rollup 或其他支持 ESM 的前端工程。

```ts
import {
  initMyASCF,
  type BridgeResponse
} from 'miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const response: BridgeResponse = await client.send('ui.showToast', {
  message: 'hello from esm'
});
```

`createMyASCF(options?)` 只创建 client，不挂载全局对象；`initMyASCF(options?)` 会挂载 `window.myascf` 并注册 `window.__myascf_on_native_response__`。两者都可以通过 `targetWindow` 指定目标 Window，便于 iframe 或测试环境集成。

自定义挂载时，使用 `client.handleNativeResponse(response)` 接回 Native 响应；`initMyASCF()` 已自动完成这一步。

## Typed API

类型由 `tools/api-manifest.json` 自动生成：

```ts
import { createTypedApi, initMyASCF } from 'miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);

await client.sendTyped('ui.showToast', { message: 'hello' });
const item = await api.system.storage.getItem({ key: 'username' });
console.log(item.data?.value);

const network = await api.network.request({
  url: 'https://example.com/api/user',
  method: 'GET',
  timeout: 10000,
  responseType: 'json'
}, { timeout: 12000 });
console.log(network.data?.statusCode);
```

重新生成：

```bash
npm run prebuild
```

SDK build 会自动执行生成器。generated 文件不应手工修改。

## Public Exports

- `createMyASCF(options?)`
- `initMyASCF(options?)`
- `ERROR_CODE_SUCCESS` (`0`)
- `ERROR_CODE_CALLBACK_LOST` (`1004`)
- `ERROR_CODE_TIMEOUT` (`1005`)
- `ERROR_CODE_NATIVE_UNAVAILABLE` (`1006`)
- `ERROR_CODE_INVALID_RESPONSE` (`1007`)
- `createTypedApi(client)`
- `ApiAction`、`ApiParamsMap`、`ApiResponseDataMap`、`TypedBridgeResponse`
- BridgeRequest、BridgeResponse、ApiSummary 等 TypeScript 类型

## ArkWeb Boundary

```text
H5 client
-> window.MyASCFNative.postMessage
-> myascf_runtime HAR
-> window.__myascf_on_native_response__
-> callback map
-> Promise resolve / reject
```

SDK 依赖 HarmonyOS ArkWeb 注入 `window.MyASCFNative`。普通浏览器没有该对象，调用 `send()` 会以 `NATIVE_UNAVAILABLE` reject，这是预期行为。

现有名称与协议保持不变：

- `window.MyASCFNative`
- `window.__myascf_on_native_response__`
- `window.myascf.send(action, params, options?)`
- BridgeRequest / BridgeResponse JSON 结构

## Local npm Pack

```bash
npm run pack:check
npm run pack:local
```

候选包会包含 IIFE、ESM、声明文件、README、LICENSE 与 CHANGELOG，不包含 `src`、`tests`、`scripts` 或 `node_modules`。当前 `private: true`，只做本地 tarball 验证，不执行 `npm publish`。

外部 ESM 消费示例见 `examples/sdk-consumer-demo`。

## Testing

```bash
npm test
npm run check
```

当前使用 Node 原生 test runner，直接测试 IIFE 与 ESM 构建产物。用例覆盖 requestId、请求协议、成功与错误响应、timeout、callback lost、Native 不可用、非法响应、DebugPanel 安全调用、`sendTyped`、`createTypedApi` 和 `network.request` 的双 timeout 参数与脱敏记录。

`npm test` 会先重建产物，避免测试旧 `dist`。`npm run check` 还会先检查 generated 文件是否过期，再运行 16 个测试并执行无 lifecycle 副作用的 `npm pack --dry-run`。完整说明见 [H5 SDK 测试指南](../docs/testing/h5-sdk-test-guide.md)。

H5 SDK 不直接发起 HTTP；`network.request` 由 ArkTS Runtime 执行。`params.timeout` 控制 Native 网络超时，`options.timeout` 控制 SDK 等待回调超时，后者应略大于前者。

## Current Limits

- SDK 尚未发布到 npm。
- H5 类型由 JSON Manifest 镜像生成；ArkTS Manifest 与 JSON 尚未统一为一个来源。
- SDK 不替代容器白名单、安全策略或 Native 参数校验。
