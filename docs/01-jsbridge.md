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
-> Toast / Clipboard / Storage / Network Biz
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
- `network.request`、复杂参数、Native 网络超时与 HTTP 状态码返回。
- BridgeCallbackExecutor 统一 runJavaScript 回调。
- DebugPanel 调用链记录。
- H5 侧 NATIVE_UNAVAILABLE 与 INVALID_RESPONSE。
- Web 容器加载进度、URL Guard、错误状态与重试。
- runtime 本地 HAR 与 `MyASCFRuntime` 门面。
- H5 SDK IIFE + ESM 构建、npm pack 与外部 ESM consumer 本地验证。
- Manifest JSON 生成 `ApiAction`、Params Map、Response Map 与 typed helper。
- `sendTyped` 与 `createTypedApi` 复用现有 `send`，不改变 Bridge 协议。

## 当前边界

H5 SDK 已发布为 `@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0`。`network.request` 由 ArkTS Runtime 执行，H5 SDK 仍只负责 Bridge 请求和 callback 生命周期。H5 类型已由 JSON Manifest 镜像生成，后续仍需把 ArkTS Manifest、JSON、Markdown 与 H5 类型统一到真正的单一来源。

## 质量检查

H5 SDK 使用 Node 原生 test runner 验证 IIFE、ESM、requestId、callback map、timeout、callback lost、Native 不可用、非法响应、DebugPanel 安全调用和 typed API。根目录一致性脚本检查 JSON Manifest、ActionNames、ApiManifest、RuntimeBootstrap、生成文档、生成类型与 package exports。

```bash
npm run check
```

自动化测试通过只代表浏览器侧协议和静态工程关系通过。ArkWeb 注入、`runJavaScript`、Toast、Clipboard、Storage、DebugPanel 与 Web 容器状态仍按 [手工冒烟测试](testing/manual-smoke-test.md) 在 DevEco Studio 中验证。

仓库已增加 `.github/workflows/ci.yml`，在 push 和 pull request 时运行生成物检查、Manifest 对齐、H5 SDK build/test、pack dry-run 与 package exports 检查。CI 不修改 JSBridge 协议，也不替代 ArkWeb 真机链路验证。

v0.1.0 的完整链路演示和面试讲解分别维护在 [Demo Walkthrough](showcase/demo-walkthrough.md) 与 [Interview Talk Track](showcase/interview-talk-track.md)，两者只描述当前已实现协议和公开能力。

源码回读入口见 [Source Code Walkthrough](learning/source-code-walkthrough.md)、[Runtime Source Map](learning/runtime-source-map.md) 和 [H5 SDK Source Map](learning/h5-sdk-source-map.md)。这些文档只解释现有主链路，没有改变 JSBridge 协议或新增 API。
