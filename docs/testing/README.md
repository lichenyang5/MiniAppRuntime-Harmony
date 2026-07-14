# 测试与回归

这篇文档解决什么问题：说明项目当前有哪些自动化检查、哪些场景仍需手工验证，以及开发和发布前应从哪里开始执行回归。

## 测试分层

| 层级 | 覆盖范围 | 执行方式 |
| --- | --- | --- |
| H5 SDK 单元测试 | IIFE、ESM、requestId、Promise、错误与 typed API | `npm --prefix h5_sdk test` |
| 工程一致性检查 | Manifest、ArkTS action 注册、生成文档、生成类型、包导出 | `npm run check` |
| HarmonyOS 冒烟测试 | ArkWeb、HAR、Native API、DebugPanel、Web 容器状态 | 按手工清单在 DevEco Studio 执行 |

## 快速入口

```bash
npm run check
```

该命令会依次验证：

1. API 文档和 H5 类型生成物未过期。
2. JSON Manifest、ActionNames、ApiManifest 和 RuntimeBootstrap 对齐。
3. H5 SDK 能构建，13 个单元测试通过，`npm pack --dry-run` 成功。
4. `main`、`module`、`types` 和 `exports` 指向的文件存在，ESM 入口可导入且包含必要运行时导出。

## 文档索引

- [H5 SDK 测试指南](h5-sdk-test-guide.md)
- [HarmonyOS 手工冒烟测试](manual-smoke-test.md)
- [发布回归清单](release-regression-checklist.md)

## 自动化边界

Node 测试可以模拟 `window.MyASCFNative` 与 Native 响应，但不能替代 ArkWeb、HarmonyOS Kit、权限和设备行为验证。Toast、Clipboard、Storage、URL Guard、错误页与 DebugPanel 的真实链路仍以手工冒烟结果为准。

## GitHub Actions

仓库已配置 `.github/workflows/ci.yml`，在 push 到 `main`/`master` 和 pull request 时自动运行生成物、Manifest、H5 SDK build/test、pack dry-run 与 package exports 检查。详细步骤见 [CI 文档](../ci/README.md)。ArkTS/HAP 构建和设备冒烟仍需单独的 HarmonyOS 环境。
