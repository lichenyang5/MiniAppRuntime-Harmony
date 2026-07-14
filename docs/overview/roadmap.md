# Roadmap

这篇文档解决什么问题：记录项目真实完成状态和后续计划，避免 README、文档与代码进度不一致。

## 已完成

- [x] ArkWeb 加载本地 H5。
- [x] H5 到 ArkTS JavaScriptProxy 通信。
- [x] requestId、Promise、callback map 与统一错误处理。
- [x] BridgeController、BridgeDispatcher、HandlerRegistry 与 Biz/Imp 分层。
- [x] Toast、Clipboard、Storage 与 `runtime.getApiList`。
- [x] DebugPanel、API Manifest 与 API 文档生成。
- [x] runtime 抽取为 `myascf_runtime` 本地 HAR，并提供 `MyASCFRuntime` 门面。
- [x] Web 容器加载进度、URL Guard 与错误状态。
- [x] H5 SDK 抽离、TypeScript 类型与 rawfile 同步。
- [x] H5 SDK IIFE script 产物。
- [x] H5 SDK ESM import 产物。
- [x] TypeScript 声明入口。
- [x] API 类型由 Manifest JSON 自动生成。
- [x] H5 SDK `sendTyped` 与 nested typed helper。
- [x] npm pack dry-run、tarball 与外部 ESM consumer 验证。
- [x] v0.1.0 包边界、LICENSE、CHANGELOG 与 Release 文档整理。
- [x] H5 SDK 单元测试与 JSBridge 协议回归。
- [x] API Manifest、ActionNames、ApiManifest 与 RuntimeBootstrap 一致性检查。
- [x] API 文档和 typed API 生成物过期检查。
- [x] H5 SDK package exports 与 npm pack dry-run 检查。
- [x] HarmonyOS 手工冒烟与发布回归清单。
- [x] GitHub Actions CI 配置。
- [x] CI 中执行 H5 SDK build/test 与 npm pack dry-run。
- [x] v0.1.0 Release Notes、候选验收清单和 Showcase 文档。
- [x] 稳定截图命名与真实采集清单。

## 待完成

- [ ] 补充真实运行截图。
- [ ] 发布并根据反馈修订博客。
- [ ] 从单一数据源生成 ArkTS Manifest、Markdown 和 H5 类型。
- [ ] 发布 H5 SDK 到 npm。
- [ ] 调研 HAR 对应的 HarmonyOS 包发布方式。
- [ ] Network API。
- [ ] 处理当前 SDK 的废弃 API 与权限警告。
- [ ] ArkTS runtime 自动化测试。
- [ ] GitHub Release artifact automation。
- [ ] 带人工审批的 npm publish。
- [ ] HarmonyOS 工程自动化检查。

## 边界

当前项目用于开源学习和工程实践，不宣称实现完整小程序规范，也不宣称已达到生产 SDK 的安全、兼容性和发布要求。H5 SDK 当前保持 `private: true`，双产物只完成本地构建与 pack 验证，没有执行 npm publish。
