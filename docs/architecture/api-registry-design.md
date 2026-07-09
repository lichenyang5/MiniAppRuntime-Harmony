# API 注册设计

这篇文档解决的问题：说明后续 HandlerRegistry 要解决什么问题，以及为什么 API 能力不应该散落在 Web 页面或 BridgeController 中。

## 当前状态

当前尚未实现，后续阶段补充。

## 设计目标

后续 `HandlerRegistry` 会负责：

- 注册 action 与 handler 的对应关系。
- 查询 action 对应的处理器。
- 为 Dispatcher 提供明确的 API 查找入口。
- 避免在 BridgeController 中写大量条件判断。

## 初步方向

第一版只注册一个 action：

```text
ui.showToast
```

等单个 action 跑通后，再扩展更多 API。
