# Release Plan

这篇文档解决什么问题：分阶段记录 GitHub 展示、H5 SDK npm 准备和 HAR 发布方式调研，避免一次性承诺过多。

## v0.1.0：GitHub 展示版

- 提供 `myascf_runtime` 本地 HAR。
- 提供 H5 SDK TypeScript 源码、dist 和类型声明。
- 提供可运行 entry Demo、DebugPanel 和 Web 容器状态展示。
- 提供 API、架构、接入、调试和 Release 文档。
- 完成 H5 SDK npm pack 和外部 consumer 本地预检。
- 提供测试、CI、Showcase、Release Notes 和候选验收清单。
- 不发布 npm，不发布 HarmonyOS 包。

当前状态：候选展示文档已整理，仍需候选 commit 的 GitHub Actions 结果、设备回归和真实截图。

## v0.2.0：反馈与发布准备

- 确认 npm 包名和公开命名。
- 在现有 IIFE/ESM、typed API 和 npm pack 结果上补充浏览器兼容验证。
- 根据 v0.1.0 反馈完善 API 类型、错误语义和兼容性说明。
- 补充 README 英文摘要与浏览器测试矩阵。
- 根据实际反馈决定是否移除 `private: true`。

## v0.3.0：发布与生态调研

- 视包名、测试和文档状态决定是否发布 H5 SDK 到 npm。
- 调研 HarmonyOS HAR 对应的包管理与发布方式。
- 保持本地 HAR 接入可用，继续完善外部 Demo 指南。

版本号是计划边界，不是发布日期承诺。未完成验收时可以调整内容和版本节奏。
