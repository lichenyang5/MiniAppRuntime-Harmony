# 项目结构

你将学会什么：找到 H5 SDK、ArkTS Runtime、可运行 Demo、生成工具和文档入口。

| 目录 | 职责 |
| --- | --- |
| `h5_sdk/` | npm H5 SDK，包含 IIFE/ESM、Promise、timeout、AbortSignal 和 typed API |
| `myascf_runtime/` | OHPM HAR Runtime，包含 Bridge、注册分发、Biz/Imp 和 Manifest |
| `entry/` | 仓库内源码联调 Demo，加载 rawfile H5 |
| `examples/npm-har-consumer-demo/` | 只消费 npm `0.1.0` 与 OHPM `1.0.0` 的独立 Demo |
| `tools/` | Manifest 一致性、API 文档和 SDK 类型生成 |
| `scripts/` | 文档链接、公开内容、HAR 构建与发布前检查 |
| `docs/` | 学习路径、API、示例、排障、发布记录和文章 |

阅读源码时建议从 `h5_sdk/src/index.ts` 和 `myascf_runtime/src/main/ets/MyASCFRuntime.ets` 两个门面开始，再沿一次真实 action 进入 Biz/Imp。

## 下一步阅读

- [H5 SDK 安装](../guide/h5-sdk-installation.md)
- [Runtime 安装](../guide/runtime-installation.md)
- [实现原理文章](../articles/juejin-implementation.md)
