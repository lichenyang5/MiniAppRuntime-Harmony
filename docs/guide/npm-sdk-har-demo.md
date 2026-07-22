# npm SDK + HAR Demo

这篇文档解决什么问题：完整复现 React H5、npm SDK、本地 HAR 和 ArkWeb 的消费链路。

## 目录

```text
examples/npm-har-consumer-demo/
  web/       React + Vite，SDK 来自 npm registry
  harmony/   Stage Model Demo，Runtime 来自 entry/libs HAR
```

## 构建顺序

```powershell
.\scripts\build-har.ps1
.\scripts\copy-har-to-demo.ps1
```

```bash
cd examples/npm-har-consumer-demo/web
npm ci
npm run build:harmony
```

`build:harmony` 先执行 TypeScript/Vite 构建，再把 JS/CSS 内联为单个页面并同步到 HarmonyOS rawfile。内联是当前 ArkWeb `resource://rawfile` 场景的已验证方案，可避免 origin 为 `null` 时外链 module 和 stylesheet 被 CORS 拦截。

## 运行顺序

1. DevEco Studio 打开 `examples/npm-har-consumer-demo/harmony`。
2. Sync Project，配置本机调试签名，Clean、Rebuild、Run。
3. 依次验证 Toast、Runtime API List、Storage Set/Get、Clipboard Write/Read、Network GET 和 Network non-2xx。

## 完整调用链

```mermaid
flowchart LR
  A[React / H5] --> B[npm H5 SDK]
  B --> C[window.MyASCFNative.postMessage]
  C --> D[ArkWeb JavaScriptProxy]
  D --> E[BridgeController]
  E --> F[Dispatcher]
  F --> G[HandlerRegistry]
  G --> H[Biz]
  H --> I[Imp]
  I --> J[HarmonyOS API]
  J --> K[BridgeCallbackExecutor]
  K --> L[runJavaScript]
  L --> M[H5 callback map]
  M --> N[Promise resolve / reject]
```

## HTTP 状态语义

Bridge 成功不等于 HTTP 2xx。有效 HTTP 404/500 仍然 resolve，`data.ok` 为 `false`，`data.statusCode` 保留真实状态；DNS、连接失败、非法 URL 和网络超时才 reject。

## 调试

- 页面环境区检查四个 Bridge 全局对象。
- 结果区检查 action、requestId、code、message、data、duration、HTTP status 和 ok。
- HiLog 使用 `[ArkWeb]`、`[JavaScriptProxy]`、`[BridgeController]`、`[Dispatcher]`、`[CallbackExecutor]` 过滤。
- 截图清单见 [Demo Assets](../assets/demo/README.md)。

