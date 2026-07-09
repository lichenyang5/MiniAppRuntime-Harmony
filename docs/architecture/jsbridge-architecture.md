# JSBridge 架构

这篇文档解决的问题：说明当前 JSBridge 已经实现到哪里、H5 与 ArkTS 如何通信、协议如何设计，以及后续为什么需要 Dispatcher 和 Registry。

## 当前实现状态

当前 JSBridge 只实现到 JavaScriptProxy 最小通信边界：

```text
H5 window.myascf.send
-> window.MyASCFNative.postMessage
-> ArkTS JavaScriptProxy.postMessage
-> BridgeController.handleMessage
-> BridgeDispatcher.dispatch
-> HandlerRegistry.get
-> ui.showToast mock handler
-> WebviewController.runJavaScript
-> H5 window.__myascf_on_native_response__
-> Promise resolve / reject
```

## H5 请求协议

```json
{
  "requestId": "string",
  "action": "ui.showToast",
  "params": {
    "message": "hello from h5"
  }
}
```

字段说明：

- `requestId`：H5 生成，用来匹配回调。
- `action`：能力名称，后续会交给 Dispatcher 分发。
- `params`：调用参数，后续会交给 Biz 层校验。

## ArkTS 响应协议

当前返回 mock response：

```json
{
  "requestId": "对应请求 requestId",
  "code": 0,
  "message": "mock handler success from BridgeDispatcher",
  "data": {
    "echoAction": "ui.showToast"
  }
}
```

后续真实能力接入后，`data` 会由具体 API handler 返回。

## H5 Callback Map

H5 侧维护 callback map：

```js
var callbacks = new Map();
```

每次调用 `window.myascf.send` 时，H5 将 `requestId` 和当前 Promise 的 `resolve / reject` 存起来。ArkTS 回调 H5 后，H5 根据 response 中的 `requestId` 找回 callback。

这个设计支持：

- 并发调用。
- 异步回调。
- 后续 timeout。
- 后续标准错误处理。

## JavaScriptProxy

ArkTS 通过 `javaScriptProxy` 注入 H5 可访问的对象：

```ts
name: 'MyASCFNative'
methodList: ['postMessage']
```

H5 调用：

```js
window.MyASCFNative.postMessage(JSON.stringify(request))
```

当前 `postMessage` 只把原始字符串交给 `BridgeController`，BridgeController 再把标准请求交给 `BridgeDispatcher`。

## Dispatcher 与 Registry

当前已经接入最小分发链路：

```text
BridgeDispatcher
-> HandlerRegistry
-> ui.showToast mock handler
```

Dispatcher 负责处理 UNKNOWN_ACTION 和 INTERNAL_ERROR。Registry 只负责 action 与 handler 的注册和查询。

## runJavaScript 回调

ArkTS 使用 `WebviewController.runJavaScript` 调用 H5 的全局回调：

```js
window.__myascf_on_native_response__(responseText)
```

为了避免 JSON 字符串破坏 JS 脚本，ArkTS 会把 response 字符串再次 `JSON.stringify` 成安全参数。

## 当前尚未实现

- ToastBiz。
- ToastImp。
- `promptAction.showToast`。
- timeout。
- 完整错误处理。
- 批量 API 注册。

## 下一步

下一步接入 `ToastBiz` 和 `ToastImp`，让 `ui.showToast` 从 mock handler 变成真实 HarmonyOS Toast 能力调用。
