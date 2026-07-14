# Changelog

这份文件记录 MiniAppRuntime-Harmony 的公开功能变化。项目当前处于个人开源学习与工程实践阶段。

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

### Notes

- 当前版本用于 GitHub 源码展示、本地 HAR 接入和 H5 SDK dist 验证。
- H5 SDK 尚未发布到 npm，HAR 尚未发布到 HarmonyOS 包仓库。
