# JSBridge 当前实现状态

这篇文档解决的问题：同步记录当前 JSBridge 实现状态，满足本项目本地 skill 对 `docs/01-jsbridge.md` 的要求。更完整的结构化文档见 `architecture/jsbridge-architecture.md`。

## 当前链路

```text
H5 window.myascf.send
-> window.MyASCFNative.postMessage
-> ArkTS JavaScriptProxy.postMessage
-> BridgeController.handleMessage
-> BridgeDispatcher.dispatch
-> HandlerRegistry.get
-> ToastBiz / ClipboardBiz / StorageBiz
-> ToastImp / ClipboardImp / StorageImp
-> HarmonyOS Public Kit
-> BridgeCallbackExecutor
-> WebviewController.runJavaScript
-> H5 window.__myascf_on_native_response__
-> H5 DebugPanel
-> Promise resolve / reject
```

当前 ArkTS runtime 核心代码已经位于 `myascf_runtime` HAR 模块中，`entry` 只负责 Web 容器页面和 H5 Demo。

entry 通过 `MyASCFRuntime` 接入 HAR，不再直接组装 BridgeController、Dispatcher、Registry 或 RuntimeBootstrap。

## 已实现

- H5 侧 `window.myascf.send(action, params)` 返回 Promise。
- H5 侧生成 `requestId`。
- H5 侧维护 callback map。
- ArkTS 侧通过 `javaScriptProxy` 暴露 `window.MyASCFNative.postMessage`。
- BridgeController 解析 `BridgeRequest`。
- BridgeDispatcher 统一分发 action。
- HandlerRegistry 注册和查询 handler。
- 当前注册 Toast、Clipboard 和 Storage 三组真实 API。
- ToastBiz 校验 `params.message`。
- ToastImp 调用公开 HarmonyOS Toast 能力。
- ClipboardBiz / ClipboardImp 支持 `system.clipboard.writeText` 和 `system.clipboard.readText`。
- StorageBiz / StorageImp 支持 setItem、getItem、removeItem 和 clear。
- BridgeCallbackExecutor 统一封装 `runJavaScript` 回调。
- H5 send 支持 timeout。
- H5 能识别 callback lost。
- H5 DebugPanel 展示最近 20 条调用记录。
- ArkTS 侧通过 `runJavaScript` 回调 H5。
- Runtime 核心代码已抽取为 `myascf_runtime` HAR 模块。
- HAR 对外入口已封装为 `MyASCFRuntime`。
- GitHub README、架构图和文档导航已整理为公开展示口径。
- Web 容器支持加载进度、URL Guard、错误状态和重试入口。

## 下一步

下一步优先补充真实截图并发布博客；功能方向可选择 Network API、API 文档生成或 H5 SDK npm 化。
