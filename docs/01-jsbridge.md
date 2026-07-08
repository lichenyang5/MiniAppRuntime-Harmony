# JSBridge 当前实现状态

## 当前阶段

当前 JSBridge 只实现到 JavaScriptProxy 最小通信边界：

```text
H5 window.myascf.send
-> window.MyASCFNative.postMessage
-> ArkTS JavaScriptProxy.postMessage
-> BridgeController.handleMessage
-> WebviewController.runJavaScript
-> H5 window.__myascf_on_native_response__
-> Promise resolve / reject
```

## 已实现

- H5 侧 `window.myascf.send(action, params)` 返回 Promise。
- H5 侧生成 `requestId`。
- H5 侧维护 callback map。
- ArkTS 侧通过 `javaScriptProxy` 暴露 `window.MyASCFNative.postMessage`。
- ArkTS 侧接收原始 JSON 字符串并打印 `requestId / action / params`。
- ArkTS 侧返回 mock response。
- ArkTS 侧通过 `runJavaScript` 回调 H5。

## 暂未实现

- BridgeDispatcher。
- HandlerRegistry。
- ToastBiz。
- ToastImp。
- `promptAction.showToast`。
- timeout。
- 完整错误处理。
- 批量 API 注册。

## 当前协议

H5 请求：

```json
{
  "requestId": "string",
  "action": "ui.showToast",
  "params": {
    "message": "hello from h5"
  }
}
```

ArkTS mock response：

```json
{
  "requestId": "对应请求 requestId",
  "code": 0,
  "message": "mock success from ArkTS",
  "data": {
    "echoAction": "ui.showToast"
  }
}
```

## 下一步

下一步只接入 `BridgeDispatcher` 和 `HandlerRegistry`，并继续限制为 `ui.showToast` 一个 action。真实 HarmonyOS Toast 能力会等 `ToastBiz` 和 `ToastImp` 阶段再接入。
