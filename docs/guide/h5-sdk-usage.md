# H5 SDK 使用指南

这篇文档解决什么问题：说明 H5 页面如何通过 script 或 ESM 两种方式接入 SDK，并调用 ArkTS runtime。

当前候选版本为 `0.1.0`，尚未发布到 npm，仓库内通过 dist 文件或本地 tarball 验证。

## Script 方式

适用于 ArkWeb rawfile 和无前端构建工具的页面：

```html
<script src="./js/debug-panel.js"></script>
<script src="./js/myascf.js"></script>
<script src="./js/demo.js"></script>
```

IIFE 加载后自动挂载 `window.myascf`：

```js
const response = await window.myascf.send(
  'ui.showToast',
  { message: 'hello from h5' },
  { timeout: 5000 }
);
```

构建并同步 rawfile：

```bash
npm --prefix h5_sdk install
npm run h5:sync
```

## ESM 方式

适用于 TypeScript 与现代前端工程：

```ts
import {
  initMyASCF,
  type BridgeResponse
} from '@lichenyang5/miniapp-runtime-harmony-web-sdk';

const myascf = initMyASCF();
const response: BridgeResponse = await myascf.send('ui.showToast', {
  message: 'hello from esm'
});
```

需要自行管理挂载时，可以使用：

```ts
import { createMyASCF } from '@lichenyang5/miniapp-runtime-harmony-web-sdk';

const myascf = createMyASCF();
// createMyASCF 不会修改 window.myascf。
window.__myascf_on_native_response__ = (response) => {
  myascf.handleNativeResponse(response);
};
```

## 类型化 API

```ts
import { createTypedApi, initMyASCF } from '@lichenyang5/miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);

await client.sendTyped('ui.showToast', { message: 'hello' });
const result = await api.system.storage.getItem({ key: 'username' });
console.log(result.data?.value);
```

`sendTyped` 和 nested helper 的类型由 `tools/api-manifest.json` 生成，运行时仍复用通用 `send`。完整说明见 [typed API 使用指南](typed-api-usage.md)。

## Native 边界

SDK 通过以下对象把请求发给 ArkWeb JavaScriptProxy：

```js
window.MyASCFNative.postMessage(requestText);
```

ArkTS 通过 `runJavaScript` 调用：

```js
window.__myascf_on_native_response__(responseText);
```

SDK 根据 `requestId` 找回 callback，按 `code` resolve 或 reject Promise。普通浏览器没有 `window.MyASCFNative`，因此返回 `NATIVE_UNAVAILABLE` 是预期行为。

## Timeout 与错误

`options.timeout` 默认为 5000ms。超时后 SDK 删除 callback 并 reject `TIMEOUT`；之后到达的响应记为 `CALLBACK_LOST`。格式错误的响应记为 `INVALID_RESPONSE`，不会让页面主链路直接崩溃。

## 本地 Tarball 验证

```bash
cd h5_sdk
npm run pack:local

cd ../examples/sdk-consumer-demo
npm install
npm test
```

consumer 示例通过包名进行真实 ESM import，并验证 package exports 与类型声明。当前不执行 `npm publish`。
