# API 注册设计

这篇文档解决的问题：说明 HandlerRegistry 如何管理 action 与 handler 的关系，以及为什么 API 能力不应该散落在 Web 页面或 BridgeController 中。

## 当前状态

当前已经实现最小 Registry：

```text
HandlerRegistry.register(action, handler)
HandlerRegistry.get(action)
HandlerRegistry.has(action)
```

当前只注册一个 action：

```text

ui.showToast
```

handler 仍然是 mock handler，不调用 ToastBiz / ToastImp。

## 为什么需要 Registry

如果没有 Registry，BridgeController 或 Dispatcher 很容易写成大量条件判断。Registry 把 action 和 handler 的绑定变成显式注册，后续新增 API 时只需要注册新 handler。

## 职责边界

Registry 只负责：

- 注册 action。
- 查询 handler。
- 判断 action 是否存在。

Registry 不负责：

- 解析 JSON。
- 校验参数。
- 调用 ArkWeb。
- 调用 HarmonyOS 系统能力。
- 回调 H5。

## 当前注册流程

当前通过 `RuntimeBootstrap.createRegistry()` 创建 Registry，并注册 `ui.showToast` mock handler。

```text
RuntimeBootstrap
-> HandlerRegistry.register("ui.showToast", ShowToastMockHandler)
-> BridgeDispatcher.dispatch(request)
-> HandlerRegistry.get(request.action)
```

ArkTS 侧统一通过 `ACTION_UI_SHOW_TOAST` 常量引用 action，避免在运行时代码中到处硬编码字符串。

## 后续扩展

后续会把 mock handler 替换成真实分层：

```text
ui.showToast handler
-> ToastBiz
-> ToastImp
-> promptAction.showToast
```

更多 API 会等 `ui.showToast` 闭环稳定后再接入。
