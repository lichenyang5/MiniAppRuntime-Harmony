# H5 SDK 设计

这篇文档解决什么问题：解释浏览器侧 SDK 的职责、双入口设计，以及它如何与 ArkTS HAR 配合。

## 模块职责

```text
h5_sdk              浏览器请求生命周期与构建产物
myascf_runtime HAR   ArkTS 解析、分发、Biz/Imp 与平台调用
entry               ArkWeb 容器、代理注入与演示页面
```

H5 SDK 负责 requestId、callback map、timeout、Native adapter、response 校验与 DebugPanel 通知。它不实现 Toast、Clipboard、Storage，不调用 HarmonyOS Kit，也不负责 Dispatcher、Registry 或容器 URL Guard。

## 双入口

```text
src/index.ts      -> dist/index.esm.js -> npm / bundler import
src/auto-init.ts  -> dist/myascf.js    -> rawfile script
```

`index.ts` 没有顶层挂载副作用，导入后由使用者选择 `createMyASCF()` 或 `initMyASCF()`。`auto-init.ts` 专门调用 `initMyASCF()`，保证原有 rawfile 页面无需修改。

这种拆分避免了 ESM consumer 仅仅 import 包就自动写入全局对象，同时保持 ArkWeb script 的即插即用行为。

`createMyASCF()` 不写入全局回调，适合自定义边界；调用方通过公开的 `client.handleNativeResponse()` 把 Native response 交还给该实例。`initMyASCF()` 则自动注册全局回调。

## Manifest 生成类型

```text
tools/api-manifest.json
-> tools/generate-sdk-types.js
-> generated/api-types.ts
-> generated/api-client.ts
-> client.sendTyped / createTypedApi
```

`sendTyped` 只把受约束的 action 与 params 转发到 `send`。nested helper 由同一个生成器按 action 路径创建，不复制 JSBridge 生命周期逻辑。

## Client 生命周期

1. `send()` 生成 requestId 并保存 callback。
2. NativeAdapter 调用 `window.MyASCFNative.postMessage`。
3. ArkTS 完成处理后调用 `window.__myascf_on_native_response__`。
4. Client 校验 BridgeResponse 并按 requestId 取出 callback。
5. `code === 0` 时 resolve，其余标准错误响应 reject。

## 构建与类型

esbuild 分别输出 IIFE 与 ESM 单文件 bundle；TypeScript 负责严格类型检查和 declaration-only 输出。`package.json` 的 `main`、`module`、`types` 与 `exports` 均指向实际存在的产物。

`dist/index.d.ts` 是 ESM 类型入口。`dist/myascf.d.ts` 只为 IIFE 副作用入口加载全局 Window 声明，不虚构 IIFE 命名导出。包内还包含声明入口依赖的模块声明文件。

## 兼容约束

双产物构建没有改变：

- `window.myascf.send(...)`
- `window.MyASCFNative`
- `window.__myascf_on_native_response__`
- BridgeRequest / BridgeResponse 协议
- DebugPanel 生命周期钩子

## 当前边界

包保持 `private: true`，只做 `npm pack` 和本地 ESM consumer 预检。H5 类型已经由 JSON Manifest 镜像生成，但 ArkTS Manifest 与 JSON 的单一来源统一仍是后续工作。
