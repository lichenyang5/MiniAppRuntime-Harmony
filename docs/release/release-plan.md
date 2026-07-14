# Release Plan

这篇文档解决什么问题：分阶段记录 GitHub 展示、H5 SDK npm 准备和 HAR 发布方式调研，避免一次性承诺过多。

## v0.1.0：GitHub 展示版

- 提供 `myascf_runtime` 本地 HAR。
- 提供 H5 SDK TypeScript 源码、dist 和类型声明。
- 提供可运行 entry Demo、DebugPanel 和 Web 容器状态展示。
- 提供 API、架构、接入、调试和 Release 文档。
- 不发布 npm，不发布 HarmonyOS 包。

当前状态：准备中，仍需设备回归和真实截图。

## v0.2.0：H5 SDK npm 预备版

- 确认 npm 包名和公开命名。
- 使用 `npm pack` 检查候选包内容。
- 完善逐 action API 类型和兼容性说明。
- 补充 README 英文摘要与浏览器测试矩阵。
- 根据实际反馈决定是否移除 `private: true`。

## v0.3.0：发布与生态调研

- 视包名、测试和文档状态决定是否发布 H5 SDK 到 npm。
- 调研 HarmonyOS HAR 对应的包管理与发布方式。
- 保持本地 HAR 接入可用，继续完善外部 Demo 指南。

版本号是计划边界，不是发布日期承诺。未完成验收时可以调整内容和版本节奏。
