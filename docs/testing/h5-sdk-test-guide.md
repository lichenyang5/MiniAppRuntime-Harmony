# H5 SDK 测试指南

这篇文档解决什么问题：说明 H5 SDK 单元测试覆盖什么、如何运行，以及模拟浏览器和 ArkWeb 通信边界时有哪些限制。

## 工具选择

当前使用 Node 原生 test runner，不额外引入 Vitest 或 DOM 模拟库。SDK 只依赖少量 `window` 边界，现有轻量 mock 已能覆盖 IIFE、ESM 和 JSBridge 协议；保持零新增测试依赖也让本地 pack 预检更直接。

测试文件位于 `h5_sdk/tests/sdk.test.js`，直接验证构建后的 `dist` 产物，而不是只验证源码函数。

## 运行命令

```bash
npm --prefix h5_sdk test
npm --prefix h5_sdk run check
```

- `test`：先构建最新 IIFE/ESM/声明文件，再运行单元测试，避免误测旧 `dist`。
- `check`：先确认生成物未过期，再构建、运行测试并执行无 lifecycle 副作用的 `npm pack --dry-run`。

修改 SDK 源码后重新执行 `npm test`。当前没有提供 watch 命令，避免源码变化但 `dist` 未重建时产生假阳性。

## 当前覆盖

- ESM 导出与无自动挂载副作用。
- IIFE 自动挂载 `window.myascf` 和响应回调。
- `requestId` 前缀与多次调用唯一性。
- `postMessage` 请求中的 requestId、action 和 params。
- 成功响应 resolve，非零 code reject。
- `TIMEOUT`、`CALLBACK_LOST`、`NATIVE_UNAVAILABLE`、`INVALID_RESPONSE`。
- 无 DebugPanel 时正常调用，DebugPanel 方法抛错时主链路不受影响。
- timeout 的 `recordError` 和 callback lost 的 `recordLost`。
- `sendTyped`、`createTypedApi`、Toast、Storage 与 `runtime.getApiList` action 映射。

## Mock 方式

测试构造最小 `window` 对象并注入 `MyASCFNative.postMessage`，再调用 `__myascf_on_native_response__` 模拟 ArkTS 的 `runJavaScript` 回调。每个测试使用独立窗口对象，避免 callback map 和全局挂载互相污染。

timeout 用例使用很短的真实超时时间，使套件保持快速并避免额外 fake timer 依赖。若后续出现更复杂的定时器、重试或轮询，再评估引入可控时钟。

## 新增用例原则

修改协议边界、错误码、callback 生命周期、生成 typed helper 或 package 入口时，应先添加能复现回归的测试。涉及真实 ArkWeb、HarmonyOS 权限或 Kit 的行为，应同时更新手工冒烟清单。
