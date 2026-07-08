# JavaScriptProxy 最小通信边界

## 本步骤目标

本步骤实现 H5 到 ArkTS 的最小通信边界，并通过 ArkTS mock response 验证 H5 Promise 可以 resolve。

目标链路：

```text
H5 点击按钮
-> window.myascf.send("ui.showToast", { message: "hello from h5" })
-> H5 生成 requestId
-> H5 通过 window.MyASCFNative.postMessage(JSON.stringify(request)) 调用 ArkTS
-> ArkTS JavaScriptProxy 接收原始 JSON 字符串
-> BridgeController 解析 requestId / action / params 并打印日志
-> BridgeController 构造 mock response
-> WebviewController.runJavaScript 调用 H5 全局回调
-> H5 根据 requestId 找到 Promise callback
-> H5 页面展示 resolve 结果
```

本步骤不实现 Dispatcher / HandlerRegistry / Biz / Imp，也不调用真实 HarmonyOS 能力。

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
docs/03-javascript-proxy-boundary.md
docs/01-jsbridge.md
```

## 为什么先做 JavaScriptProxy 边界

JavaScriptProxy 是 H5 调用 ArkTS 的入口。如果入口不稳定，后续 Dispatcher、Registry、Biz、Imp 都无法被可靠验证。

先做通信边界的原因：

- 先证明 H5 可以把字符串消息送到 ArkTS。
- 先证明 ArkTS 可以用 `runJavaScript` 回调 H5。
- 先让 requestId 和 Promise callback 配对跑通。
- 避免过早引入 action 分发和真实系统 API，降低问题定位成本。
- 保持第一阶段最小闭环的节奏，每一步都可运行、可验收。

## H5 到 ArkTS 的最小通信链路

H5 侧通过 `window.myascf.send(action, params)` 发起调用。当前 `send` 方法会：

1. 生成唯一 `requestId`。
2. 组装标准请求对象。
3. 将 `resolve / reject` 保存到 callback map。
4. 调用 ArkWeb 注入的 `window.MyASCFNative.postMessage(requestText)`。

ArkTS 侧通过 `javaScriptProxy` 注入 `MyASCFNative`：

```ts
Web({ src: $rawfile('web/index.html'), controller: this.controller })
  .javaScriptProxy({
    object: this.nativeProxy,
    name: 'MyASCFNative',
    methodList: ['postMessage'],
    controller: this.controller
  })
```

`JavaScriptProxy.postMessage(message)` 只负责把消息交给 `BridgeController`，不做业务逻辑。

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

字段说明：

- `requestId`：H5 生成，用于匹配 ArkTS 回调。
- `action`：能力名称，本步骤只透传和打印，不做分发。
- `params`：调用参数，本步骤只透传和打印，不做业务校验。

## 响应协议

当前 ArkTS 返回 mock response：

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

`code === 0` 时 H5 Promise resolve；否则 H5 Promise reject。

## ArkTS 严格类型约束

当前工程启用了 ArkTS 严格检查，运行时协议类型不能使用松散 `object` 或未声明的 `{}` 字面量。

因此本步骤在 `BridgeTypes.ets` 中显式声明：

- `BridgeRequestParams`：当前只包含可选 `message` 字段。
- `BridgeResponseData`：当前只包含 `echoAction` 字段。

`BridgeController` 构造 mock response 时也先创建 `BridgeResponseData` 类型变量，再放入 `BridgeResponse.data`，避免触发 `arkts-no-untyped-obj-literals`。

## H5 Callback Map 的作用

H5 侧维护一个 callback map：

```js
var callbacks = new Map();
```

每次调用 `window.myascf.send` 时，H5 会把当前 `requestId` 对应的 `resolve / reject` 存入 map。ArkTS 回调 H5 后，H5 根据 response 中的 `requestId` 找到对应 callback，然后 resolve 或 reject。

这一步是后续并发调用、超时控制和错误回调的基础。

## ArkTS 回调 H5 的方式

ArkTS 侧通过 `WebviewController.runJavaScript` 执行 H5 全局回调：

```ts
window.__myascf_on_native_response__(responseText)
```

为了避免 JSON 字符串里的引号破坏 JavaScript 脚本，ArkTS 会先对 response 字符串再做一次 `JSON.stringify`，把它变成安全的 JS 字符串参数。

## 当前 Mock Response 的原因

本步骤只验证通信边界，不验证真实业务能力。mock response 可以确认：

- H5 能调用 ArkTS。
- ArkTS 能解析请求。
- ArkTS 能回调 H5。
- H5 能通过 requestId resolve 对应 Promise。

真实 `ui.showToast` 会在后续接入 Dispatcher、HandlerRegistry、ToastBiz、ToastImp 后再实现。

## 验收标准

- HarmonyOS 应用可以正常启动。
- ArkWeb 仍然可以加载本地 H5 页面。
- 点击 H5 页面按钮后，H5 调用 `window.myascf.send("ui.showToast", { message: "hello from h5" })`。
- ArkTS 能收到 H5 传来的 JSON 字符串。
- ArkTS 能打印 `requestId`、`action`、`params`。
- ArkTS 能返回 mock response。
- H5 Promise 能 resolve。
- 页面能展示 ArkTS 返回的 mock response。
- 本次不实现 Dispatcher / Registry / Biz / Imp。
- 本次不调用真实 `promptAction.showToast`。

## 下一步计划

下一步接入 `BridgeDispatcher` 和 `HandlerRegistry`，但仍然只注册 `ui.showToast` 一个 action：

1. 新增 `BridgeDispatcher`，统一处理 action 分发。
2. 新增 `HandlerRegistry`，负责注册和查询 handler。
3. 暂时只注册 `ui.showToast`。
4. 仍先返回 mock handler response，不直接扩大 API 面。
5. Dispatcher / Registry 稳定后，再进入 `ToastBiz` 和 `ToastImp`。
