# 告别 Controller 里的 if else：Dispatcher、Registry 与 Biz/Imp

这篇文档解决什么问题：解释 API 增多后，如何保持通信入口稳定，并让能力扩展成为注册行为。

如果 BridgeController 同时解析 JSON、判断 action、校验参数、调用系统 API 和拼接回调脚本，每新增一个能力都要修改核心入口。当前架构让 Controller 只负责请求边界，再把 BridgeRequest 交给 Dispatcher。

Dispatcher 根据 action 查询 HandlerRegistry。找到 handler 就执行，找不到就统一返回 UNKNOWN_ACTION；handler 抛出的异常统一转换为 INTERNAL_ERROR。Registry 只维护 action 与 handler 的映射，RuntimeBootstrap 负责注册内置能力。

Biz 面向 JSBridge 协议，负责参数校验、业务语义和 BridgeResponse；Imp 面向 HarmonyOS 公开 Kit，不关心 requestId、H5 callback 或 Registry。

```text
system.storage.setItem
-> StorageBiz 校验 key/value
-> StorageImp 调用 Preferences
-> BridgeResponse
```

Toast、Clipboard 和 Storage 都复用同一条 Controller/Dispatcher/CallbackExecutor 主链路。Storage 需要 Context，也由 MyASCFRuntime 门面传入，外部 Demo 不手动创建 Biz/Imp。

分层的目的不是增加目录，而是隔离变化：协议集中在 Bridge 类型，action 扩展集中在注册，参数规则集中在 Biz，平台 API 变化集中在 Imp。
