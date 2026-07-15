# MiniAppRuntime-Harmony 文档

这篇文档解决什么问题：提供统一阅读入口，让开发者、面试官和后续维护者快速找到架构、接入、API、调试、阶段记录和博客草稿。

## 推荐阅读顺序

1. [项目介绍](overview/project-introduction.md)
2. [运行时架构](architecture/runtime-architecture.md)
3. [JSBridge 架构](architecture/jsbridge-architecture.md)
4. [HAR 模块设计](architecture/har-module-design.md)
5. [新建 Demo 接入 HAR](guide/create-demo-with-har.md)
6. [Biz / Imp 分层](architecture/biz-imp-layer-design.md)
7. [Web 容器设计](architecture/web-container-design.md)
8. [调试指南](debug/debug-guide.md)
9. [API Manifest 设计](architecture/api-manifest-design.md)
10. [新增 API 指南](guide/add-new-api.md)
11. [生成 API 文档](guide/generate-api-docs.md)
12. [H5 SDK 设计](architecture/h5-sdk-design.md)
13. [H5 SDK 使用指南](guide/h5-sdk-usage.md)
14. [H5 SDK 类型化 API](guide/typed-api-usage.md)
15. [发布前整理指南](guide/release-guide.md)
16. [Release Plan](release/release-plan.md)
17. [npm Pack 验证](release/npm-pack-verify.md)
18. [测试与回归](testing/README.md)
19. [手工冒烟测试](testing/manual-smoke-test.md)
20. [发布回归清单](testing/release-regression-checklist.md)
21. [GitHub Actions CI](ci/README.md)
22. [Project Showcase](showcase/project-showcase.md)
23. [Demo Walkthrough](showcase/demo-walkthrough.md)
24. [Interview Talk Track](showcase/interview-talk-track.md)
25. [v0.1.0 Release Notes](release/v0.1.0-release-notes.md)
26. [源码调用链导读](learning/source-code-walkthrough.md)
27. [ArkTS Runtime Source Map](learning/runtime-source-map.md)
28. [H5 SDK Source Map](learning/h5-sdk-source-map.md)
29. [我现在对项目的理解](learning/what-i-understand-now.md)
30. [v0.1.0 Self-check Report](release/v0.1.0-self-check-report.md)

## 目录作用

| 目录 | 作用 |
| --- | --- |
| `overview/` | 项目定位、真实进度和后续计划 |
| `architecture/` | runtime、JSBridge、HAR、Biz/Imp 和 WebContainer 设计 |
| `guide/` | HAR、H5 SDK、文档生成和新建 Demo 接入步骤 |
| `api/` | 已实现 action 的参数、响应和错误约定 |
| `debug/` | DebugPanel、RuntimeLogger 和常见问题 |
| `stages/` | 从初始化到 Web 容器增强的阶段记录 |
| `assets/` | Mermaid 架构图与真实截图证据目录 |
| `learning/` | 源码回读、双端源码地图和个人理解复盘 |
| `blogs/` | 8 篇系列博客草稿和发布顺序 |
| `release/` | 版本计划、npm 检查清单和 GitHub Release 模板 |
| `testing/` | H5 SDK 单元测试、工程一致性检查、手工冒烟与发布回归 |
| `ci/` | GitHub Actions 触发条件、自动检查步骤与设备验证边界 |
| `showcase/` | 项目展示、演示路径、技术亮点和面试讲解材料 |

## API

- [ui.showToast](api/ui-show-toast.md)
- [API 总览](api/index.md)
- [Runtime API](api/runtime.md)
- [Clipboard](api/clipboard.md)
- [Storage](api/storage.md)
- [错误码](api/error-code.md)

## 当前状态

已完成 JSBridge 主链路、Toast/Clipboard/Storage、DebugPanel、本地 HAR、MyASCFRuntime、Web 容器增强、API Manifest、API 文档生成、H5 SDK IIFE/ESM、Manifest 类型生成、typed helper 和 npm pack 本地验证。当前已有 7 张真实证据图片，Clipboard 独立结果、Web loading 和 URL Guard/错误页仍待补；博客发布、Network API、npm publish 和 HAR 发布方式调研尚未完成。

## Release

- [Release Preparation](../RELEASE.md)
- [发布前整理指南](guide/release-guide.md)
- [Release Plan](release/release-plan.md)
- [H5 SDK npm Checklist](release/npm-publish-checklist.md)
- [H5 SDK npm Pack 验证](release/npm-pack-verify.md)
- [GitHub Release Template](release/github-release-template.md)
- [v0.1.0 Release Notes](release/v0.1.0-release-notes.md)
- [v0.1.0 候选验收清单](release/v0.1.0-checklist.md)
- [v0.1.0 自检报告](release/v0.1.0-self-check-report.md)

## 测试与质量

- [测试与回归入口](testing/README.md)
- [H5 SDK 测试指南](testing/h5-sdk-test-guide.md)
- [HarmonyOS 手工冒烟测试](testing/manual-smoke-test.md)
- [发布回归清单](testing/release-regression-checklist.md)

根目录执行 `npm run check` 可验证 H5 SDK、API Manifest、生成文档、生成类型和包导出。ArkWeb 与 HarmonyOS Native 行为仍需在 DevEco Studio 中按手工清单验证。

GitHub Actions 配置见 [CI 文档](ci/README.md)。workflow 自动运行 Node 工具链检查，但不替代 HAP 构建和设备冒烟。

## 面试讲解路径

建议按“问题 -> 设计 -> 扩展 -> 工程化”讲解：ArkWeb 与 H5 如何通信，为什么需要 requestId 和 callback map，为什么拆 Dispatcher/Registry/Biz/Imp，如何集中回调与错误处理，最后说明 HAR 门面和 Web 容器增强怎样让项目不止停留在单页 Demo。可直接使用 [Interview Talk Track](showcase/interview-talk-track.md)，现场操作见 [Demo Walkthrough](showcase/demo-walkthrough.md)。

## Showcase

- [Project Showcase](showcase/project-showcase.md)
- [Demo Walkthrough](showcase/demo-walkthrough.md)
- [Interview Talk Track](showcase/interview-talk-track.md)
- [Technical Highlights](showcase/technical-highlights.md)
- [真实截图采集清单](assets/screenshots/README.md)

## 公开边界

所有文档只描述本仓库自行实现的代码和公开 HarmonyOS 能力。项目用于开源学习与工程实践，不夸大为完整小程序平台或生产级 SDK。
