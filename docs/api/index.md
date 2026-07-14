# API 总览

这篇文档解决的问题：说明当前 runtime 支持哪些 API，每个 API 的 action、参数、返回值和实现状态是什么。

## 当前支持

| Category | Action | Params | Response | Status | 文档 |
| --- | --- | --- | --- | --- | --- |
| UI | `ui.showToast` | `message: string` | `echoAction` | 已实现 | [Toast](ui-show-toast.md) |
| System | `system.clipboard.writeText` | `text: string` | `echoAction` | 已实现 | [Clipboard](clipboard.md) |
| System | `system.clipboard.readText` | - | `echoAction, text` | 已实现 | [Clipboard](clipboard.md) |
| System | `system.storage.setItem` | `key: string, value: string` | `echoAction, key, value` | 已实现 | [Storage](storage.md) |
| System | `system.storage.getItem` | `key: string` | `echoAction, key, value` | 已实现 | [Storage](storage.md) |
| System | `system.storage.removeItem` | `key: string` | `echoAction, key` | 已实现 | [Storage](storage.md) |
| System | `system.storage.clear` | - | `echoAction` | 已实现 | [Storage](storage.md) |
| Runtime | `runtime.getApiList` | - | `echoAction, apis: ApiSummary[]` | 已实现 | [Runtime](runtime.md) |

统一错误说明见 [错误码](error-code.md)。

## API 元信息来源

HAR 内的 `ApiManifest.ets` 保存完整元信息，包括分类、描述、参数、响应、错误、Biz、Imp 和示例。ActionNames 只定义稳定 action 常量，RuntimeBootstrap 只把 action 与 handler 注册到 HandlerRegistry。

DebugPanel 通过 `runtime.getApiList` 动态读取精简 Manifest，不再维护独立静态 action 列表。

## 新增 API 需要同步更新

ActionNames、ApiManifest、Biz、Imp、RuntimeBootstrap、BridgeTypes、H5 Demo/API 列表、`docs/api` 和 README 表格都需要同步更新。完整步骤见 [新增 API 指南](../guide/add-new-api.md)。
