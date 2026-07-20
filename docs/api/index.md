# API 总览

这篇文档解决的问题：说明当前 runtime 支持哪些 API，每个 API 的 action、参数、返回值和实现状态是什么。

## 当前支持

<!-- API_TABLE_START -->
| Category | Action | Params | Response | Status |
| --- | --- | --- | --- | --- |
| runtime | `runtime.getApiList` | - | `apis: ApiSummary[]` | ✅ |
| ui | `ui.showToast` | `message: string` | `echoAction: string` | ✅ |
| system | `system.clipboard.writeText` | `text: string` | `echoAction: string` | ✅ |
| system | `system.clipboard.readText` | - | `echoAction: string, text: string` | ✅ |
| system | `system.storage.setItem` | `key: string, value: string` | `echoAction: string, key: string, value: string` | ✅ |
| system | `system.storage.getItem` | `key: string` | `echoAction: string, key: string, value: string` | ✅ |
| system | `system.storage.removeItem` | `key: string` | `echoAction: string, key: string` | ✅ |
| system | `system.storage.clear` | - | `echoAction: string` | ✅ |
| network | `network.request` | `url: string, method?: NetworkMethod, headers?: NetworkHeaders, body?: string, timeout?: number, responseType?: NetworkResponseType` | `ok: boolean, statusCode: number, statusText: string, headers: NetworkHeaders, body: NetworkBody, duration: number` | ✅ |
<!-- API_TABLE_END -->

统一错误说明见 [错误码](error-code.md)。

## 自动生成内容

- [API 表格](generated-api-table.md)
- [API Manifest 展开说明](generated-api-manifest.md)

运行 `npm run docs:api` 或 `node tools/generate-api-docs.js` 重新生成。标记区块和两个 generated 文件不建议手动修改。

## 手写 API 文档

- [ui.showToast](ui-show-toast.md)
- [Clipboard](clipboard.md)
- [Storage](storage.md)
- [Runtime](runtime.md)
- [错误码](error-code.md)

## API 元信息来源

HAR 内的 `ApiManifest.ets` 保存完整元信息，包括分类、描述、参数、响应、错误、Biz、Imp 和示例。ActionNames 只定义稳定 action 常量，RuntimeBootstrap 只把 action 与 handler 注册到 HandlerRegistry。

DebugPanel 通过 `runtime.getApiList` 动态读取精简 Manifest，不再维护独立静态 action 列表。

## 新增 API 需要同步更新

ActionNames、ApiManifest、Biz、Imp、RuntimeBootstrap、BridgeTypes、H5 Demo/API 列表、`docs/api` 和 README 表格都需要同步更新。完整步骤见 [新增 API 指南](../guide/add-new-api.md)。
