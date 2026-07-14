# H5 SDK 类型化 API 使用指南

这篇文档解决什么问题：说明为什么需要 typed API、如何使用 `sendTyped` 与 `createTypedApi`，以及类型如何从 API Manifest 重新生成。

## 为什么需要 typed API

通用 `send(action, params, options)` 适合兼容动态 action，但 action 是字符串，IDE 无法精确提示每个 API 的参数和响应。typed API 在不改变 BridgeRequest / BridgeResponse 协议的前提下增加编译期约束：

- action 只能是当前 Manifest 中的值。
- 必填参数缺失或字段类型错误会在 TypeScript 阶段报错。
- `response.data` 会根据 action 得到对应类型。
- nested helper 提供更容易发现的 API 路径。

## 通用 send 与 sendTyped

通用调用保持不变：

```ts
await client.send('ui.showToast', { message: 'hello' });
```

类型化调用：

```ts
const response = await client.sendTyped('system.storage.getItem', {
  key: 'username'
});

console.log(response.data?.value);
```

无参数 API 可以省略 params：

```ts
await client.sendTyped('system.clipboard.readText');
```

需要为无参数 API 设置 timeout 时，保留 `undefined` 参数位：

```ts
await client.sendTyped('system.clipboard.readText', undefined, {
  timeout: 3000
});
```

`sendTyped` 内部直接调用原有 `send`，不复制 requestId、callback map、timeout 或错误处理逻辑。

## createTypedApi

```ts
import {
  createTypedApi,
  initMyASCF
} from 'miniapp-runtime-harmony-web-sdk';

const client = initMyASCF();
const api = createTypedApi(client);

await api.ui.showToast({ message: 'hello' });
const clipboard = await api.system.clipboard.readText();

await api.system.storage.setItem({
  key: 'username',
  value: 'lichenyang'
});

const item = await api.system.storage.getItem({ key: 'username' });
console.log(item.data?.value);

const list = await api.runtime.getApiList();
console.log(list.data?.apis);
```

helper 只是对 `sendTyped` 的嵌套封装，不引入新的 Native API。

## 类型来源

```text
tools/api-manifest.json
-> tools/generate-sdk-types.js
-> h5_sdk/src/generated/api-types.ts
-> h5_sdk/src/generated/api-client.ts
-> ESM / IIFE / d.ts
```

生成文件带有 `AUTO-GENERATED` 标记，不应直接编辑。修改 API 元信息后执行：

```bash
npm run sdk:types
```

同时刷新 API 文档和 SDK 类型：

```bash
npm run generate
```

`h5_sdk` 的 `prebuild` 也会自动运行类型生成器，防止构建旧类型。

## 当前限制

- `tools/api-manifest.json` 当前是 ArkTS Manifest 的 JSON 镜像，需要随 runtime 能力同步维护。
- 生成器当前支持 `string`、`number`、`boolean`、`unknown`、`ApiSummary` 及数组形式。
- 只有 Manifest 中 `implemented: true` 的 API 会进入 `ApiAction` 与 typed helper。
- 类型只提供编译期体验，Native 侧 Biz 参数校验仍是安全边界。
- 当前没有发布 npm，示例通过本地 tarball 验证。

后续可以建立真正的单一结构化来源，同时生成 ArkTS Manifest、文档、H5 类型与更多 SDK 封装。
