# Roadmap

这篇文档解决什么问题：记录项目真实完成状态和后续计划，避免 README、文档与代码进度不一致。

## 当前版本与维护顺序

截至 2026-10-21，当前公开组合为 H5 SDK `0.1.0` 与 OHPM Runtime `1.1.1`。1.1.0 增加宿主 `registerCustomApi`，1.1.1 修复 Bridge 参数正文日志；独立 React Todo 已完成原生文件备份、合并恢复和重启真机验收。GitHub 已创建 [v1.0.0 Release](https://github.com/lichenyang5/MiniAppRuntime-Harmony/releases/tag/v1.0.0)。包发布与消费证据见 [npm 发布记录](../release/v0.1.0-publish-record.md)、[OHPM 验证记录](../release/ohpm-readiness-report.md)和[独立消费 Demo](../../examples/npm-har-consumer-demo/README.md)。历史阶段编号不代表下一次发布版本。

优先维护以下事项：

1. 确认历史签名凭据已轮换或吊销，并记录 Git 历史处置结果；当前配置清理不能作为凭据已失效的证据。
2. 按[手工冒烟清单](../testing/manual-smoke-test.md)记录测试 commit、设备、系统、SDK、日期和结果，优先覆盖 Clipboard 权限、Network 超时/取消及 ArkWeb 拦截和错误恢复。
3. 复核公开 npm/OHPM 组合的首次接入流程，补齐真实截图与演示，保持快速开始、包版本和验收记录一致。
4. 在以上验证完成后扩展 ArkTS 自动化测试与发布产物自动化，再评估新增 API。

公开包和 Release 已存在，但不代表真机矩阵或历史凭据处置已经完成。

## 已完成

- [x] ArkWeb 加载本地 H5。
- [x] H5 到 ArkTS JavaScriptProxy 通信。
- [x] requestId、Promise、callback map 与统一错误处理。
- [x] BridgeController、BridgeDispatcher、HandlerRegistry 与 Biz/Imp 分层。
- [x] Toast、Clipboard、Storage 与 `runtime.getApiList`。
- [x] DebugPanel、API Manifest 与 API 文档生成。
- [x] runtime 抽取为 `myascf_runtime` HAR，提供 `MyASCFRuntime` 门面并发布 OHPM `1.0.0`。
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
- [x] 从当前公开配置移除签名材料并补充忽略规则。
- [ ] 轮换或吊销已进入远端历史的签名凭据，并确认是否重写历史。
- [ ] 补全候选版本的设备、SDK、日期和 CI 链接验收记录。
- [ ] 发布并根据反馈修订博客。
- [ ] 从单一数据源生成 ArkTS Manifest、Markdown 和 H5 类型。
- [x] 发布 H5 SDK `0.1.0` 到 npm，并完成 registry 消费验证。
- [x] 发布 Runtime `1.0.0` 到 OHPM，并完成独立 Demo 安装与编译验证。
- [x] 创建 GitHub `v1.0.0` Release。
- [ ] 处理当前 SDK 的废弃 API 与权限警告。
- [ ] ArkTS runtime 自动化测试。
- [ ] GitHub Release artifact automation。
- [ ] 带人工审批的 npm publish。
- [ ] HarmonyOS 工程自动化检查。

## v0.1.0 历史发布准备

本节保留早期准备记录。当前发布状态以顶部版本说明及 `v1.0.0` Release 为准，未确认的验收和凭据处置事项仍保持待办。

- [x] README showcase。
- [x] Release Notes、Self-check Report、Publish Record 和 GitHub Release 模板。
- [x] `9de3f82` 的 GitHub Actions CI。
- [x] 综合掘金文章草稿与发布清单。
- [x] 清理当前文件中的签名配置。
- [ ] 轮换或吊销历史凭据并确定 Git 历史处置方案。
- [ ] 重新执行最终发布 commit 的自动检查、CI 和手工 smoke test。
- [ ] 发布掘金文章并回填真实链接。
- [x] 后续以 `v1.0.0` tag 和 GitHub Release 对外发布。
- [ ] 补齐 Clipboard、Web loading、URL Guard/错误页截图。

截图和验收缺口仍需补齐；签名凭据处置应在后续发布前确认，不能因为现有 Release 已创建而标为完成。

## v0.2.0 历史能力阶段

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

当前项目用于开源学习和工程实践，不宣称实现完整小程序规范，也不夸大安全、兼容性和发布成熟度。H5 SDK `0.1.0` 已发布到 npm，Runtime `1.1.1` 已发布到 OHPM，独立消费 Demo 使用公开 registry 依赖；GitHub `v1.0.0` Release 已创建。设备链路验证、历史凭据处置和发布自动化仍按各自待办推进。
