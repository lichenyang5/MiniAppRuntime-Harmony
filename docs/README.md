# MiniAppRuntime-Harmony 文档

## 你将学会什么

按从接入到原理、从 API 到排错的顺序理解并使用这个受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架。

## 推荐学习路径

1. [项目介绍](getting-started/introduction.md)
2. [从新建工程跑通 Runtime](getting-started/quick-start.md)
3. [架构概览](getting-started/architecture-overview.md)
4. [ArkWeb 接入](guide/arkweb-integration.md)
5. [请求 ID 与 callback map](concepts/request-id-and-callback-map.md)
6. [Dispatcher 与 Registry](concepts/dispatcher-and-registry.md)
7. [Biz 与 Imp](concepts/biz-and-imp.md)
8. [API Reference](api/README.md)
9. [完整 React 示例](examples/complete-react-app.md)
10. [调试指南](guide/debugging.md)

## 目录说明

| 目录 | 内容 |
| --- | --- |
| `getting-started/` | 项目定位、快速开始、架构和仓库结构 |
| `guide/` | npm/OHPM 安装、ArkWeb、API、错误、取消、调试与扩展 |
| `concepts/` | JSBridge 协议、分发注册、分层、Manifest 和包边界 |
| `api/` | 九个公开 API 的参数、响应、权限、错误和示例 |
| `examples/` | Toast、Clipboard、Storage、Network 与完整 React 应用 |
| `troubleshooting/` | Native 不可用、超时、回调丢失、白屏、OHPM 和网络排错 |
| `architecture/` | 运行时各模块的深入设计记录 |
| `testing/` | 自动检查、手工冒烟和发布回归清单 |
| `release/` | 版本说明、包发布记录与维护流程 |
| `articles/` | 掘金与 HarmonyOS 社区长文草稿 |

## 当前公开版本

- npm：`@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0`
- OHPM：`myascf_runtime@1.0.0`
- 公开 API：9 个；内部取消 action：1 个
- 独立 Demo：使用 registry 包，不依赖仓库内本地 HAR
- Runtime 发布包最低兼容 API：23；本次初始化实测设备 API：24

首次接入优先使用[纯 HTML 最小示例](../examples/minimal-runtime-consumer/README.md)。官方 ASCF 模板迁移、Windows 构建和真机验收记录见[初始化指南](guide/windows-initialization.md)；React 接入见[React 快速开始](getting-started/react-quick-start.md)。

## 按任务查找

| 我想做什么 | 文档 |
| --- | --- |
| 新项目接入 | [H5 SDK 安装](guide/h5-sdk-installation.md) / [Runtime 安装](guide/runtime-installation.md) |
| 配置 ArkWeb | [ArkWeb Integration](guide/arkweb-integration.md) |
| 调用 API | [API 使用](guide/api-usage.md) / [API Reference](api/README.md) |
| 处理超时或取消 | [Timeout and Cancellation](guide/timeout-and-cancellation.md) |
| 定位白屏 | [ArkWeb White Screen](troubleshooting/arkweb-white-screen.md) |
| 扩展 action | [Extending API](guide/extending-api.md) |
| 准备面试讲解 | [架构概览](getting-started/architecture-overview.md) / [实现原理文章](articles/juejin-implementation.md) |

## 文章

- [掘金：框架全景介绍](articles/juejin-framework-overview.md)
- [掘金：JSBridge 实现原理](articles/juejin-implementation.md)
- [HarmonyOS 社区：接入指南](articles/harmonyos-community-guide.md)
- [npm 与 OHPM 双包发布边界](articles/publishing-npm-and-ohpm.md)

## 文档维护

API 表、API Manifest 详情、SDK 类型和完整 React 示例均有自动生成或一致性检查。修改 action、示例源码或包导出后，执行：

```bash
npm run generate
npm run docs:examples
npm run check
```

HarmonyOS 真机能力不能由 Node 检查替代，发布前还要执行 [手工冒烟测试](testing/manual-smoke-test.md)。

## 下一步

- [快速开始](getting-started/quick-start.md)
- [API Reference](api/README.md)
- [故障排查](troubleshooting/native-unavailable.md)
