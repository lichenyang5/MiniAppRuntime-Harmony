# Changelog

这份文件记录 MiniAppRuntime-Harmony 的公开功能和分发变化。

## [1.1.1] - 2026-10-16

### Fixed

- 隐去非网络 Bridge 请求的参数正文，避免宿主自定义 API 的备份内容、存储值和剪贴板文本写入公共日志；保留请求 ID、action、响应码和原有网络诊断摘要。

## [1.0.0] - 2026-07-27

### Added

- 发布 `myascf_runtime@1.0.0` 到 OHPM，公共入口以 `MyASCFRuntime` 门面和必要类型为主。
- 发布 `@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0` 到 npm，提供 IIFE、ESM 与 TypeScript 类型。
- 完成 JavaScriptProxy、BridgeController、Dispatcher、Registry、Biz/Imp 与统一回调链路。
- 提供 Toast、Clipboard、Storage、`runtime.getApiList` 和 `network.request`，共 9 个公开 action。
- `network.request` 支持 2xx/4xx/5xx HTTP 状态语义、network timeout、AbortController 与并发定向取消。
- 提供 API Manifest、生成型 API 文档、类型化 helper、DebugPanel 与日志脱敏。
- 提供 ArkWeb 加载状态、URL Guard、错误页、独立 npm + OHPM 消费 Demo 和 CI 检查。
- 补充完整教程、概念文档、API Reference、排错手册、示例、发布说明和社区文章草稿。

### Notes

- HTTP 4xx/5xx 在获得有效响应时 resolve，使用 `data.ok` 和 `data.statusCode` 判断 HTTP 成功。
- `network.abort` 是内部 action，不进入公开 Manifest 返回和类型化 API。
- download/upload、WebSocket、Cookie 管理、自动重试、CLI 和生产级安全沙箱不在当前范围。
- npm 与 OHPM 包已发布；本记录不代表 GitHub tag、GitHub Release 或文章已经公开发布。
