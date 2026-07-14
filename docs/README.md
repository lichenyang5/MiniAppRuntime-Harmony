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
14. [发布前整理指南](guide/release-guide.md)
15. [Release Plan](release/release-plan.md)

## 目录作用

| 目录 | 作用 |
| --- | --- |
| `overview/` | 项目定位、真实进度和后续计划 |
| `architecture/` | runtime、JSBridge、HAR、Biz/Imp 和 WebContainer 设计 |
| `guide/` | HAR、H5 SDK、文档生成和新建 Demo 接入步骤 |
| `api/` | 已实现 action 的参数、响应和错误约定 |
| `debug/` | DebugPanel、RuntimeLogger 和常见问题 |
| `stages/` | 从初始化到 Web 容器增强的阶段记录 |
| `assets/` | Mermaid 架构图与截图占位目录 |
| `blogs/` | 8 篇系列博客草稿和发布顺序 |
| `release/` | 版本计划、npm 检查清单和 GitHub Release 模板 |

## API

- [ui.showToast](api/ui-show-toast.md)
- [API 总览](api/index.md)
- [Runtime API](api/runtime.md)
- [Clipboard](api/clipboard.md)
- [Storage](api/storage.md)
- [错误码](api/error-code.md)

## 当前状态

已完成 JSBridge 主链路、Toast/Clipboard/Storage、DebugPanel、本地 HAR、MyASCFRuntime、Web 容器增强、API Manifest、API 文档生成、H5 SDK 抽离和 v0.1.0 发布前文档。真实运行截图、博客发布、Network API、逐 action 类型、npm pack/publish 和 HAR 发布方式调研尚未完成。

## Release

- [Release Preparation](../RELEASE.md)
- [发布前整理指南](guide/release-guide.md)
- [Release Plan](release/release-plan.md)
- [H5 SDK npm Checklist](release/npm-publish-checklist.md)
- [GitHub Release Template](release/github-release-template.md)

## 面试讲解路径

建议按“问题 -> 设计 -> 扩展 -> 工程化”讲解：ArkWeb 与 H5 如何通信，为什么需要 requestId 和 callback map，为什么拆 Dispatcher/Registry/Biz/Imp，如何集中回调与错误处理，最后说明 HAR 门面和 Web 容器增强怎样让项目不止停留在单页 Demo。

## 公开边界

所有文档只描述本仓库自行实现的代码和公开 HarmonyOS 能力。项目用于开源学习与工程实践，不夸大为完整小程序平台或生产级 SDK。
