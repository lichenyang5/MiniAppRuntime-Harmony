# JSBridge 当前实现状态

这篇文档解决什么问题：同步记录当前 JSBridge 实现状态，满足项目 skill 对主链路文档持续更新的要求。

## 当前链路

```text
H5 SDK send
-> window.MyASCFNative.postMessage
-> ArkTS JavaScriptProxy.postMessage
-> BridgeController
-> BridgeDispatcher
-> HandlerRegistry
-> Toast / Clipboard / Storage Biz
-> HarmonyOS Imp
-> BridgeCallbackExecutor
-> WebviewController.runJavaScript
-> window.__myascf_on_native_response__
-> H5 callback map
-> Promise resolve / reject
```

ArkTS runtime 位于 `myascf_runtime` HAR，entry 通过 `MyASCFRuntime` 门面接入，不直接组装 Controller、Dispatcher、Registry 或 RuntimeBootstrap。

## H5 SDK 边界

浏览器侧通信逻辑位于 `h5_sdk`，当前同时提供：

- `dist/myascf.js`：IIFE script，自动挂载 `window.myascf`，供 ArkWeb rawfile 使用。
- `dist/index.esm.js`：ESM import，无自动挂载副作用，导出 `createMyASCF` 与 `initMyASCF`。
- `dist/index.d.ts` 与 `dist/myascf.d.ts`：TypeScript 类型入口。

双产物构建没有改变 `window.MyASCFNative`、`window.__myascf_on_native_response__`、`window.myascf.send()` 或 BridgeRequest / BridgeResponse 协议。

## 已实现能力

- requestId、Promise、callback map、timeout 与 callback lost。
- JavaScriptProxy、Controller、Dispatcher、Registry 与 RuntimeBootstrap。
- Biz / Imp 分层。
- `ui.showToast`。
- Clipboard write/read。
- Storage set/get/remove/clear。
- `runtime.getApiList` 与 API Manifest。
- BridgeCallbackExecutor 统一 runJavaScript 回调。
- DebugPanel 调用链记录。
- H5 侧 NATIVE_UNAVAILABLE 与 INVALID_RESPONSE。
- Web 容器加载进度、URL Guard、错误状态与重试。
- runtime 本地 HAR 与 `MyASCFRuntime` 门面。
- H5 SDK IIFE + ESM 构建、npm pack 与外部 ESM consumer 本地验证。
- Manifest JSON 生成 `ApiAction`、Params Map、Response Map 与 typed helper。
- `sendTyped` 与 `createTypedApi` 复用现有 `send`，不改变 Bridge 协议。

## 当前边界

H5 SDK 保持 `private: true`，没有执行 npm publish。H5 类型已由 JSON Manifest 镜像生成，下一步是把 ArkTS Manifest、JSON、Markdown 与 H5 类型统一到真正的单一来源，并继续补充真实设备回归材料。

## 质量检查

H5 SDK 使用 Node 原生 test runner 验证 IIFE、ESM、requestId、callback map、timeout、callback lost、Native 不可用、非法响应、DebugPanel 安全调用和 typed API。根目录一致性脚本检查 JSON Manifest、ActionNames、ApiManifest、RuntimeBootstrap、生成文档、生成类型与 package exports。

```bash
npm run check
```

自动化测试通过只代表浏览器侧协议和静态工程关系通过。ArkWeb 注入、`runJavaScript`、Toast、Clipboard、Storage、DebugPanel 与 Web 容器状态仍按 [手工冒烟测试](testing/manual-smoke-test.md) 在 DevEco Studio 中验证。
