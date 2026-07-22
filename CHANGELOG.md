# Changelog

这份文件记录 MiniAppRuntime-Harmony 的公开功能变化。项目当前处于个人开源学习与工程实践阶段。

## [0.2.0] - Unreleased

### Added

- 独立 `npm-har-consumer-demo`、本地 HAR 构建/复制脚本、HAR 发布预检、完整接入教程与 ohpm 发布准备文档。
- H5 SDK 以 `@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0` 发布，并补充 registry 消费验证。
- 新增本地 tgz consumer smoke，以及 registry SDK + 本地 HAR 的独立 HarmonyOS Demo。
- 根 package 入口改为无副作用 ESM，IIFE 自动初始化保留在 `./iife` 子路径。

- `network.request` ArkTS Runtime 垂直能力链路。
- Network 响应增加 `ok`、可选 `statusText` 和可空 `body`，明确 2xx/4xx/5xx 都以 Bridge `SUCCESS` 返回。
- HTTP/HTTPS URL、method、headers、body、network timeout 与 responseType 校验。
- `NetworkBiz` / `NetworkImp` 分层、网络错误码和 HTTP 状态码返回策略。
- Manifest 生成的 `api.network.request` typed helper 与 Network 类型。
- Network Demo、DebugPanel 摘要与敏感日志脱敏。
- Network Demo 增加可编辑 Headers，DebugPanel 分开展示 Bridge、HTTP、OK、Duration 和 Error Code。
- Network 自动测试、手工 smoke test、架构与使用文档。
- `network.request` 支持 H5 `AbortController`，主动取消返回 `AbortError / ABORTED`。
- 新增 internal `network.abort`、Runtime active request registry 与并发定向取消。
- DebugPanel 增加 `CANCELLED` 和 `LATE_RESPONSE_AFTER_ABORT`，取消后的晚到响应不再误报普通 `CALLBACK_LOST`。
- 当前 NetworkKit 仅公开 `HttpRequest.destroy()`，Native 取消明确为 best-effort。

### Notes

- H5 SDK 不直接执行 HTTP；HAR 尚未发布到 GitHub Release 或 ohpm。
- v0.2.0 不包含 download/upload、WebSocket、Cookie 管理、重试或生产级证书策略。

## [0.1.0] - Unreleased

### Added

- ArkWeb 本地 H5 Demo、加载状态、URL Guard 和错误状态页。
- 基于 JavaScriptProxy 与 runJavaScript 的 H5 / ArkTS 双向通信。
- requestId、callback map、timeout 和 callback lost 处理。
- BridgeController、BridgeDispatcher、HandlerRegistry 和 RuntimeBootstrap。
- Biz / Imp 分层以及统一 BridgeCallbackExecutor。
- Toast、Clipboard、Storage 和 `runtime.getApiList` API。
- API Manifest、生成型 API 文档和 H5 DebugPanel。
- `myascf_runtime` 本地 HAR 模块与 `MyASCFRuntime` 门面。
- `h5_sdk` TypeScript 源码、浏览器脚本和类型声明。
- H5 侧 NATIVE_UNAVAILABLE 与 INVALID_RESPONSE 处理。
- H5 SDK npm pack dry-run、tarball 内容检查和外部 consumer 示例。
- H5 SDK IIFE / ESM 双产物、Manifest 类型生成、`sendTyped` 与 nested typed helper。
- H5 SDK 单元测试、API/生成物/package 一致性检查和 GitHub Actions CI 配置。
- v0.1.0 Release Notes、候选验收清单、Demo Walkthrough 与面试讲解材料。
- 源码回读地图、GitHub Release 模板、综合文章草稿与手动发布记录。

### Notes

- 当前版本用于 GitHub 源码展示、本地 HAR 接入和 H5 SDK dist 验证。
- H5 SDK 已发布到 npm；HAR 尚未发布到 HarmonyOS 包仓库。
- `9de3f82` 的 GitHub Actions 已通过，但最终发布 commit 尚未产生。
- v0.1.0 tag、GitHub Release 和技术文章尚未发布。
- 签名凭据轮换/吊销及仓库历史清理是创建 Release 前的阻塞项。
