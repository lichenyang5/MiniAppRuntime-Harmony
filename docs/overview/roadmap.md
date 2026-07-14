# Roadmap

这篇文档解决什么问题：记录项目真实完成状态和后续计划，避免 README、博客与代码进度不一致。

## 已完成

- [x] ArkWeb 加载本地 H5。
- [x] H5 -> ArkTS JavaScriptProxy 通信。
- [x] requestId、Promise 与 callback map。
- [x] BridgeController、BridgeDispatcher 与 HandlerRegistry。
- [x] RuntimeBootstrap 与 Biz / Imp 分层。
- [x] `ui.showToast`。
- [x] `system.clipboard.writeText` / `readText`。
- [x] TIMEOUT / CALLBACK_LOST 与统一错误码。
- [x] H5 DebugPanel。
- [x] runtime 抽取为 `myascf_runtime` 本地 HAR。
- [x] `MyASCFRuntime` 门面类。
- [x] Storage set/get/remove/clear。
- [x] Web 容器加载进度。
- [x] URL Guard 与轻量白名单判断。
- [x] Web 错误状态和重试入口。
- [x] GitHub README、HAR 指南、架构图和博客草稿整理。
- [x] API Manifest 能力清单。
- [x] README 与 docs API 总览表格。
- [x] API Manifest 能力列表和新增 API 模板。
- [x] `runtime.getApiList` 动态查询与 DebugPanel 动态能力列表。
- [x] Manifest JSON 生成 API Markdown 与 README 表格。

## 待完成

- [ ] 补充真实运行截图。
- [ ] 发布并根据反馈修订博客。
- [ ] 从单一数据源生成 ArkTS Manifest、Markdown 和 H5 类型。
- [ ] Network API。
- [ ] H5 SDK npm 化。
- [ ] 处理当前 SDK 的废弃 API 与权限警告。

## 边界

当前项目用于开源学习和工程实践，不宣称实现完整小程序规范，也不宣称已达到生产 SDK 的安全、兼容性和发布要求。API 数量有限，重点是展示运行时主链路、扩展方式和模块职责。
