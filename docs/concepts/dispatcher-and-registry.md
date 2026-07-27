# Dispatcher 与 Registry

你将学会什么：Runtime 为什么使用注册表，而不是在 BridgeController 里维护巨大 switch。

`HandlerRegistry` 保存 `action -> BridgeHandler`。`RuntimeBootstrap` 注册 10 个 action，`BridgeDispatcher` 只负责查找 handler、返回 `UNKNOWN_ACTION`，并把未处理异常转换为 `INTERNAL_ERROR`。

新增 API 不需要修改 JSON 解析和回调链路，扩展工作集中在 ActionNames、Manifest、Biz/Imp、注册和类型生成。

## 下一步阅读

- [Biz 与 Imp](biz-and-imp.md)
- [扩展新 API](../guide/extending-api.md)
