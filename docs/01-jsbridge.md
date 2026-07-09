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
-> ToastBiz
-> ToastImp
-> promptAction.showToast
-> ClipboardBiz / ClipboardImp
-> BridgeCallbackExecutor
-> WebviewController.runJavaScript
-> H5 window.__myascf_on_native_response__
-> Promise resolve / reject
```

## 已实现

- H5 侧 `window.myascf.send(action, params)` 返回 Promise。
- H5 侧生成 `requestId`。
- H5 侧维护 callback map。
- ArkTS 侧通过 `javaScriptProxy` 暴露 `window.MyASCFNative.postMessage`。
- BridgeController 解析 `BridgeRequest`。
- BridgeDispatcher 统一分发 action。
- HandlerRegistry 注册和查询 handler。
- 当前只注册 `ui.showToast` 一个真实 API。
- ToastBiz 校验 `params.message`。
- ToastImp 调用公开 HarmonyOS Toast 能力。
- ClipboardBiz / ClipboardImp 支持 `system.clipboard.writeText` 和 `system.clipboard.readText`。
- BridgeCallbackExecutor 统一封装 `runJavaScript` 回调。
- H5 send 支持 timeout。
- H5 能识别 callback lost。
- ArkTS 侧通过 `runJavaScript` 回调 H5。

## 暂未实现

- Storage API。

## 下一步

下一步补充 DebugPanel / RuntimeLogger 可视化，或者继续扩展 storage API。
