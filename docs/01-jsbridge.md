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
- ArkTS 侧通过 `runJavaScript` 回调 H5。

## 暂未实现

- timeout。
- 完整错误处理。
- 批量 API 注册。

## 下一步

下一步补充 `runJavaScript` 回调封装、超时控制和 callback lost 处理。
