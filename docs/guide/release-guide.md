# 发布前整理指南

这篇文档解决什么问题：说明根项目、ArkTS HAR 和 H5 SDK 如何分别管理版本、构建和候选发布物。

## 当前版本

根项目和 H5 SDK 当前使用 `0.1.0` 候选版本。`myascf_runtime/oh-package.json5` 使用 `1.0.0`，因为当前 Hvigor 的模块版本校验要求 major 从 1 开始。两个版本轨道都处于本地准备阶段，不代表 npm 或 HarmonyOS 包已经发布。

## 包边界

| 单元 | 类型 | 当前接入 | 发布状态 |
| --- | --- | --- | --- |
| `myascf_runtime` | HarmonyOS ArkTS HAR `1.0.0` metadata | `file:../myascf_runtime` | 本地包，未正式发布 |
| `h5_sdk` | JavaScript / TypeScript SDK | dist 复制到 rawfile | npm 元数据准备中，保持 private |
| `entry` | HarmonyOS Demo | DevEco Studio 运行 | 示例应用，不作为库发布 |

## 版本更新顺序

1. 明确本次真实完成的功能和兼容性变化。
2. 更新根 CHANGELOG；涉及 H5 SDK 时同步更新其 CHANGELOG。
3. 分别更新根/H5 候选版本和 HAR `oh-package.json5` 版本，不强行保持数字一致。
4. 生成 API 文档并构建 H5 SDK。
5. 运行测试、同步 rawfile、构建 HAP 并完成设备回归。
6. 更新 RELEASE 和 GitHub Release Notes。
7. 最后再决定是否创建 tag、GitHub Release 或发布具体包。

## H5 SDK

H5 SDK 可以按普通前端包思路准备 npm，但当前仍有包名确认、逐 action 类型、pack 内容检查和设备回归事项。详细步骤见 [npm 发布检查清单](../release/npm-publish-checklist.md)。

## ArkTS HAR

HAR 当前以源码模块和本地 file dependency 使用。不要使用 npm 发布术语描述它，也不要声称已经进入 HarmonyOS 包仓库。后续先调研目标 HarmonyOS SDK 对应的包格式、依赖声明和发布渠道。

## GitHub Release

GitHub Release 可以包含源码 tag、说明文档和验证结果，但不应暗示两个库包已经发布。模板见 [GitHub Release 模板](../release/github-release-template.md)，阶段规划见 [Release Plan](../release/release-plan.md)。
