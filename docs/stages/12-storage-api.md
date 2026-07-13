# Stage 12: Storage API

这篇文档解决什么问题：记录第三组真实 Native API 如何在不修改 JSBridge 主链路的前提下接入 HAR。

## 目标与原因

新增 `system.storage.setItem/getItem/removeItem/clear`，验证 Biz/Imp 分层能够承载持久状态能力。Storage 不依赖网络或远端服务，适合验证参数校验、持久化、标准错误和 DebugPanel 展示。

## 实现

`StorageBiz` 校验 key/value 并构造 BridgeResponse；`StorageImp` 使用 HarmonyOS Preferences，文件名为 `myascf_storage`。Preferences 需要 Context，因此门面构造改为：

```ts
new MyASCFRuntime(controller, getContext(this))
```

四个 action 全部由 RuntimeBootstrap 注册并经过 Dispatcher。未注册 action 仍返回 `UNKNOWN_ACTION`，参数错误返回 `PARAM_ERROR`，系统调用异常返回 `INTERNAL_ERROR`；TIMEOUT 与 CALLBACK_LOST 协议未改动。

## 验收

- set 后 get 可读取原字符串。
- remove 后 get 返回空字符串。
- clear 后已有键返回空字符串。
- 空 key、缺少 value、非字符串 value 返回 `PARAM_ERROR`。
- Toast、Clipboard、DebugPanel 和本地 HAR 导入方式保持可用。

当前范围仅包含字符串键值存储。下一步可选择 Network API、Web 容器白名单与错误页，或 API 文档生成。
