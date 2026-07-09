# 阶段 04：Dispatcher 与 Registry

这篇文档解决的问题：记录下一阶段如何把 BridgeController 中的 mock response 迁移到 Dispatcher / Registry 分发链路。

## 当前状态

当前尚未实现，后续阶段补充。

## 目标

- 新增 `BridgeDispatcher`。
- 新增 `HandlerRegistry`。
- 所有 action 统一通过 Dispatcher。
- 只注册 `ui.showToast` 一个 action。
- 暂不接入真实 Toast 能力。

## 验收方向

H5 调用 `ui.showToast` 后，ArkTS 能通过 Dispatcher 找到注册 handler，并返回 mock handler response。
