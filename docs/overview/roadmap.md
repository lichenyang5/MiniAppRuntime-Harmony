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
- [x] 稳定截图命名、真实采集清单与 7 张现有证据图片归档。
- [x] v0.1.0 源码回读地图与面试自测材料。
- [x] v0.2.0 `network.request` 垂直能力链路。
- [x] Network 参数校验、错误映射、typed API 与 DebugPanel 摘要。

## 待完成

- [ ] 补充 Clipboard、Web loading、URL Guard/错误页 3 类真实运行截图。
- [ ] 立即轮换已进入远端历史的签名凭据，并从当前文件与 Git 历史中移除签名材料。
- [ ] 补全候选版本的设备、SDK、日期和 CI 链接验收记录。
- [ ] 发布并根据反馈修订博客。
- [ ] 从单一数据源生成 ArkTS Manifest、Markdown 和 H5 类型。
- [ ] 发布 H5 SDK 到 npm。
- [ ] 调研 HAR 对应的 HarmonyOS 包发布方式。
- [ ] 处理当前 SDK 的废弃 API 与权限警告。
- [ ] ArkTS runtime 自动化测试。
- [ ] GitHub Release artifact automation。
- [ ] 带人工审批的 npm publish。
- [ ] HarmonyOS 工程自动化检查。

## v0.1.0 Release

- [x] README showcase。
- [x] Release Notes、Self-check Report、Publish Record 和 GitHub Release 模板。
- [x] `9de3f82` 的 GitHub Actions CI。
- [x] 综合掘金文章草稿与发布清单。
- [ ] 轮换或吊销已暴露签名凭据，并清理当前文件与 Git 历史。
- [ ] 重新执行最终发布 commit 的自动检查、CI 和手工 smoke test。
- [ ] 发布掘金文章并回填真实链接。
- [ ] 由项目作者手动创建 `v0.1.0` tag 和 GitHub Release。
- [ ] 补齐 Clipboard、Web loading、URL Guard/错误页截图。

截图缺口不影响继续展示源码和文档，但签名凭据处置是 tag 与 Release 的阻塞条件。

## v0.2.0

- [x] `network.request`。
- [x] Network parameter validation。
- [x] Network error mapping。
- [x] Typed network API。
- [x] Network DebugPanel record redaction。
- [ ] Download / upload。
- [ ] WebSocket。
- [ ] Advanced domain and certificate policy。

v0.2.0 只证明现有运行时可承载一条复杂异步 API，不代表已经形成完整生产网络框架。

## 边界

当前项目用于开源学习和工程实践，不宣称实现完整小程序规范，也不夸大安全、兼容性和发布成熟度。H5 SDK `0.1.0` 已发布到 npm 并完成 registry 消费验证；HAR 当前通过本地文件接入，GitHub Release 和 ohpm 仍处于准备阶段。
