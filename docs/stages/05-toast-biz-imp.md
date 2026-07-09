# 阶段 05：ToastBiz 与 ToastImp

这篇文档解决的问题：记录如何把 `ui.showToast` 从 Dispatcher mock handler 推进到真实 Biz / Imp 分层，并最终调用 HarmonyOS `promptAction.showToast`。

## 本步骤目标

本阶段只实现一个真实 API：

```text
ui.showToast
```

目标链路：

```text
H5 点击按钮
-> window.myascf.send("ui.showToast", { message: "hello from h5" })
-> JavaScriptProxy 接收消息
-> BridgeController 解析 BridgeRequest
-> BridgeDispatcher.dispatch(request)
-> HandlerRegistry 找到 ui.showToast handler
-> handler 调用 ToastBiz.handle(request)
-> ToastBiz 校验 params.message
-> ToastBiz 调用 ToastImp.showToast(message)
-> ToastImp 调用 promptAction.showToast
-> ToastBiz 返回 BridgeResponse
-> BridgeController 通过 runJavaScript 回调 H5
-> H5 Promise resolve 并展示 showToast success
```

## 修改文件

```text
entry/src/main/ets/runtime/biz/ToastBiz.ets
entry/src/main/ets/runtime/imp/ToastImp.ets
entry/src/main/ets/runtime/error/BridgeError.ets
entry/src/main/ets/runtime/registry/RuntimeBootstrap.ets
entry/src/main/ets/runtime/dispatcher/BridgeDispatcher.ets
entry/src/main/resources/rawfile/web/index.html
entry/src/main/resources/rawfile/web/js/demo.js
entry/src/main/resources/rawfile/web/css/demo.css
docs/stages/05-toast-biz-imp.md
docs/architecture/biz-imp-layer-design.md
docs/api/ui-show-toast.md
docs/api/error-code.md
```

## 为什么引入 Biz / Imp

如果 handler 里直接校验参数并调用系统 API，后续 API 增多后会很快变乱。

Biz / Imp 的拆分让职责更清晰：

- `ToastBiz` 负责参数校验、业务语义和标准响应。
- `ToastImp` 负责调用公开 HarmonyOS 系统能力。

## ToastBiz 职责

`ToastBiz` 负责：

- 接收 `BridgeRequest`。
- 校验 `request.params.message`。
- 参数错误时返回 `PARAM_ERROR`。
- 参数正确时调用 `ToastImp.showToast(message)`。
- 调用成功后返回 `showToast success`。

`ToastBiz` 不负责：

- ArkWeb 回调。
- action 注册。
- Dispatcher 分发。

## ToastImp 职责

`ToastImp` 只负责调用 HarmonyOS Toast 能力：

```ts
promptAction.showToast({
  message: message,
  duration: 2000
})
```

`ToastImp` 不关心 H5 协议、`requestId`、Dispatcher 或错误码格式。

## 参数校验规则

`params.message` 必须满足：

- 存在。
- 类型是字符串。
- `trim()` 后不是空字符串。

以下请求会返回 `PARAM_ERROR`：

```js
window.myascf.send("ui.showToast", {})
window.myascf.send("ui.showToast", { message: "" })
```

## PARAM_ERROR 返回方式

参数错误返回：

```json
{
  "requestId": "对应请求 requestId",
  "code": 1002,
  "message": "PARAM_ERROR: message is required",
  "data": {
    "echoAction": "ui.showToast"
  }
}
```

参数错误不会调用 `ToastImp`，因此不会出现真实 Toast。

## INTERNAL_ERROR 处理方式

如果 handler 执行异常，`BridgeDispatcher` 会捕获异常并返回 `INTERNAL_ERROR`。

这保证了 H5 始终通过标准 `BridgeResponse` 接收结果。

## 当前实现范围

已实现：

- `ui.showToast` 真实 handler。
- `ToastBiz` 参数校验。
- `ToastImp` 调用 `promptAction.showToast`。
- H5 正常调用按钮。
- H5 参数错误测试按钮。

未实现：

- 更多 API。
- timeout。
- callback lost 处理。
- 复杂插件系统。
- UI 组件 DSL。

## 验收标准

- 点击正常按钮后，设备或模拟器能看到真实 Toast。
- H5 Promise resolve。
- 页面展示 `showToast success`。
- 点击参数错误按钮后，不出现 Toast。
- 参数错误请求返回 `PARAM_ERROR`。
- 未注册 action 仍由 Dispatcher 返回 `UNKNOWN_ACTION`。

## 下一步计划

下一步补充 `runJavaScript` 回调封装、超时控制和 callback lost 处理。
