# 阶段 03：H5 到 ArkTS 的 JavaScriptProxy 边界

这篇文档解决的问题：记录 H5 如何通过 JavaScriptProxy 调用 ArkTS，以及 ArkTS 如何通过 mock response 回调 H5 Promise。

## 本阶段目标

```text
H5 点击按钮
-> window.myascf.send("ui.showToast", { message: "hello from h5" })
-> H5 生成 requestId
-> H5 通过 window.MyASCFNative.postMessage(JSON.stringify(request)) 调用 ArkTS
-> ArkTS JavaScriptProxy 接收原始 JSON 字符串
-> BridgeController 解析 requestId / action / params
-> BridgeController 构造 mock response
-> WebviewController.runJavaScript 调用 H5 全局回调
-> H5 根据 requestId 找到 Promise callback
-> H5 页面展示 resolve 结果
```

## 修改文件

```text
entry/src/main/ets/pages/Index.ets
entry/src/main/ets/runtime/bridge/JavaScriptProxy.ets
entry/src/main/ets/runtime/bridge/BridgeController.ets
entry/src/main/ets/runtime/api/BridgeTypes.ets
entry/src/main/ets/runtime/error/BridgeErrorCode.ets
entry/src/main/ets/runtime/logger/RuntimeLogger.ets
entry/src/main/resources/rawfile/web/index.html
entry/src/main/resources/rawfile/web/js/myascf.js
entry/src/main/resources/rawfile/web/js/demo.js
entry/src/main/resources/rawfile/web/css/demo.css
```

## 请求协议

```json
{
  "requestId": "string",
  "action": "ui.showToast",
  "params": {
    "message": "hello from h5"
  }
}
```

## 响应协议

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

## 关键设计

- H5 `send` 返回 Promise。
- H5 生成 `requestId`。
- H5 使用 callback map 保存 `resolve / reject`。
- ArkTS 只接收、解析、打印并返回 mock response。
- ArkTS 使用 `runJavaScript` 调用 `window.__myascf_on_native_response__`。
- 当前不做真实 action 分发。

## ArkTS 严格类型约束

ArkTS 严格模式不接受松散 `object` 或未声明对象字面量。因此当前协议显式声明：

- `BridgeRequestParams`
- `BridgeResponseData`
- `BridgeRequest`
- `BridgeResponse`

## 当前没有实现的能力

- Dispatcher。
- HandlerRegistry。
- ToastBiz。
- ToastImp。
- `promptAction.showToast`。

## 验收标准

- ArkWeb 仍然可以加载本地 H5 页面。
- 点击按钮后，H5 调用 `window.myascf.send("ui.showToast", { message: "hello from h5" })`。
- ArkTS 能收到 H5 传来的 JSON 字符串。
- ArkTS 能打印 `requestId`、`action`、`params`。
- ArkTS 能返回 mock response。
- H5 Promise 能 resolve。
- 页面能展示 ArkTS 返回的 mock response。

## 下一步

接入 `BridgeDispatcher` 和 `HandlerRegistry`，仍然只注册 `ui.showToast` 一个 action。
