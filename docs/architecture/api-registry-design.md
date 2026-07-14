# API 注册设计

这篇文档解决的问题：说明 HandlerRegistry 如何管理 action 与 handler，以及 ActionNames、ApiManifest 和 RuntimeBootstrap 如何协作。

## 当前 Registry

```text
HandlerRegistry.register(action, handler)
HandlerRegistry.get(action)
HandlerRegistry.has(action)
```

RuntimeBootstrap 当前注册 7 个 action：Toast 1 个、Clipboard 2 个、Storage 4 个。Dispatcher 查询 Registry，未找到时返回 UNKNOWN_ACTION，handler 异常由 Dispatcher 转换为 INTERNAL_ERROR。

## 三份信息的职责

- `ActionNames`：定义 action 常量，避免 ArkTS 运行时代码硬编码。
- `ApiManifest`：描述分类、参数、响应、错误、实现类和示例。
- `RuntimeBootstrap`：创建 handler，并注册到 HandlerRegistry。

Manifest 不负责执行注册。新增 API 时需要同时更新三者，构建和评审时对照检查。

## Registry 不负责什么

Registry 不解析 JSON、不校验参数、不调用 HarmonyOS Kit、不操作 ArkWeb，也不回调 H5。参数校验属于 Biz，平台调用属于 Imp，响应执行属于 BridgeCallbackExecutor。

## 当前注册链路

```text
MyASCFRuntime
-> RuntimeBootstrap.createRegistry(context)
-> HandlerRegistry.register(action, handler)
-> BridgeDispatcher.dispatch(request)
-> HandlerRegistry.get(request.action)
-> handler -> Biz -> Imp
```

能力元信息设计见 [API Manifest](api-manifest-design.md)，扩展步骤见 [新增 API 指南](../guide/add-new-api.md)。
