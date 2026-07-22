# H5 SDK Usage

这篇文档解决什么问题：说明 H5 SDK 的 npm、ESM、IIFE、类型化调用和错误边界。

## npm 与 ESM

```bash
npm install @lcy453/miniapp-runtime-harmony-web-sdk@0.1.0
```

```ts
import {
  createTypedApi,
  initMyASCF
} from '@lcy453/miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);
const response = await api.ui.showToast({ message: 'hello' });
```

`initMyASCF()` 创建客户端，并挂载 `window.myascf` 与 Native response callback。`createTypedApi(client)` 根据 Manifest 生成的类型提供 nested helper。底层仍可直接调用：

```ts
await client.send('ui.showToast', { message: 'hello' }, { timeout: 5000 });
```

## IIFE

`@lcy453/miniapp-runtime-harmony-web-sdk/iife` 对应全局脚本产物，加载后自动初始化。需要模块化和 tree-shaking 时优先使用 ESM。

## requestId 与 callback map

每次 `send` 生成唯一 requestId，callback map 保存 Promise 的 resolve/reject、timer、action 和参数摘要。Native response 根据 requestId 找回 callback；超时后移除 callback，晚到响应进入 CALLBACK_LOST 或取消后的晚到响应记录。

## Promise 与错误

- `code === 0`：Bridge resolve。
- `code !== 0`：Bridge reject。
- `NATIVE_UNAVAILABLE`：普通浏览器没有 `window.MyASCFNative`，属于预期边界。
- `TIMEOUT`：H5 等待 Native callback 超时。
- `CALLBACK_LOST`：response 找不到 callback。
- `INVALID_RESPONSE`：Native response 不符合协议。
- `UNKNOWN_ACTION`、参数错误、业务错误和网络错误由 Runtime 返回。

HTTP 404/500 不是 Bridge 错误：`network.request` resolve，业务通过 `response.data.ok` 和 `statusCode` 判断。

## React

```tsx
const api = createTypedApi(initMyASCF());

function ToastButton() {
  return <button onClick={() => void api.ui.showToast({ message: 'hello' })}>Toast</button>;
}
```

## Vanilla JS

```ts
const client = initMyASCF();
document.querySelector('#toast')?.addEventListener('click', async () => {
  const response = await client.send('ui.showToast', { message: 'hello' });
  console.log(response.requestId, response.data);
});
```

完整可运行示例见 `examples/npm-har-consumer-demo/web`。
