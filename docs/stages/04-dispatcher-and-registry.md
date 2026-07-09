# 阶段 04：Dispatcher 与 Registry

这篇文档解决的问题：记录如何把 BridgeController 中的 mock response 迁移到 BridgeDispatcher / HandlerRegistry 分发链路，让 action 查找和执行有清晰边界。

## 本步骤目标

本阶段只实现 Dispatcher / Registry，并且只注册一个 action：

```text
ui.showToast
```

当前 handler 仍然返回 mock response，不实现 ToastBiz，不实现 ToastImp，也不调用 HarmonyOS `promptAction.showToast`。

## 修改文件

```text
entry/src/main/ets/runtime/dispatcher/BridgeDispatcher.ets
entry/src/main/ets/runtime/registry/HandlerRegistry.ets
entry/src/main/ets/runtime/registry/RuntimeBootstrap.ets
entry/src/main/ets/runtime/api/ActionNames.ets
entry/src/main/ets/runtime/api/BridgeTypes.ets
entry/src/main/ets/runtime/bridge/BridgeController.ets
docs/stages/04-dispatcher-and-registry.md
docs/architecture/api-registry-design.md
docs/api/error-code.md
```

## 新链路

```text
H5 点击按钮
-> window.myascf.send("ui.showToast", { message: "hello from h5" })
-> JavaScriptProxy 接收消息
-> BridgeController 解析 BridgeRequest
-> BridgeDispatcher.dispatch(request)
-> HandlerRegistry 根据 action 查找 handler
-> 找到 ui.showToast mock handler
-> mock handler 返回 BridgeResponse
-> BridgeController 通过 runJavaScript 回调 H5
-> H5 Promise resolve 并展示结果
```

## 为什么要引入 Dispatcher

BridgeController 的职责应该是通信边界，而不是业务分发。引入 `BridgeDispatcher` 后：

- BridgeController 只接收 raw message、解析 request、回调 H5。
- BridgeDispatcher 统一处理 action 分发。
- 后续新增 action 时不用修改 BridgeController。
- UNKNOWN_ACTION 和 INTERNAL_ERROR 可以在统一入口处理。

## 为什么要引入 HandlerRegistry

`HandlerRegistry` 让 action 和 handler 的关系显式注册，避免把 API 能力写成一堆条件判断。

当前 Registry 只负责：

- `register(action, handler)`
- `get(action)`
- `has(action)`

Registry 不解析 request，不调用 ArkWeb，不处理业务逻辑。

## 职责边界

- `BridgeController`：接收 H5 字符串、解析 `BridgeRequest`、调用 Dispatcher、通过 `runJavaScript` 回调 H5。
- `BridgeDispatcher`：根据 `request.action` 查找 handler，统一处理 UNKNOWN_ACTION 和 INTERNAL_ERROR。
- `HandlerRegistry`：注册和查询 handler。
- `RuntimeBootstrap`：注册当前阶段内置 handler。
- `ui.showToast mock handler`：当前只返回 mock response，不调用真实 Toast 能力。

## 当前 Mock Handler

当前 `ui.showToast` handler 返回：

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

保持 mock 的原因是本阶段只验证分发机制。真实 Toast 能力会等 `ToastBiz` 和 `ToastImp` 阶段接入。

## UNKNOWN_ACTION

当 Registry 找不到 action 对应的 handler 时，Dispatcher 返回：

```json
{
  "requestId": "对应请求 requestId",
  "code": 1001,
  "message": "Unknown action: xxx",
  "data": {}
}
```

`data` 在 ArkTS 中使用显式 `BridgeResponseData` 类型承载，避免未声明对象字面量。

## INTERNAL_ERROR

当 handler 执行异常时，Dispatcher 捕获异常并返回：

```json
{
  "requestId": "对应请求 requestId",
  "code": 1003,
  "message": "Internal error while handling bridge request.",
  "data": {}
}
```

## 当前实现范围

已实现：

- BridgeDispatcher。
- HandlerRegistry。
- RuntimeBootstrap。
- `ui.showToast` mock handler。
- UNKNOWN_ACTION。
- INTERNAL_ERROR。

未实现：

- ToastBiz。
- ToastImp。
- `promptAction.showToast`。
- 更多 action。
- 复杂插件系统。

## 验收标准

- ArkWeb 仍然可以加载本地 H5 页面。
- H5 仍然调用 `window.myascf.send("ui.showToast", { message: "hello from h5" })`。
- BridgeController 能将请求交给 BridgeDispatcher。
- BridgeDispatcher 能通过 HandlerRegistry 找到 `ui.showToast` handler。
- handler 能返回 mock response。
- H5 Promise 能 resolve。
- 未注册 action 能返回 UNKNOWN_ACTION。
- 本阶段不实现 ToastBiz / ToastImp，不调用 `promptAction.showToast`。

## 下一步计划

下一步接入 `ToastBiz` 和 `ToastImp`：

1. `ToastBiz` 校验 `params.message`。
2. `ToastImp` 调用公开 HarmonyOS `promptAction.showToast`。
3. `ui.showToast` handler 从 mock response 改为真实能力调用。
