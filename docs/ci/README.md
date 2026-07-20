# GitHub Actions CI

这篇文档解决什么问题：说明仓库为什么接入 CI、自动检查覆盖哪些工程边界，以及为什么 HarmonyOS 设备链路仍需手工验证。

## 为什么接入 CI

本地 `npm run check` 已能发现生成物过期、Manifest 漂移、H5 SDK 回归和包入口错误。GitHub Actions 把这些检查放到 push 和 pull request 上执行，减少忘记生成文档、漏跑测试或提交错误 package exports 的风险。

## 触发时机

- push 到 `main` 或 `master`。
- 任意 pull request。

workflow 使用 Ubuntu runner 和 Node.js 20，只申请只读仓库权限，不使用 secrets、npm token 或发布凭据。

## 当前步骤

1. Checkout 仓库并安装 `h5_sdk` 锁定依赖。
2. 以只读模式检查 API Markdown 与 SDK typed API 生成物。
3. 检查 JSON Manifest、ActionNames、ApiManifest 与 RuntimeBootstrap 对齐。
4. 构建 H5 SDK 的 IIFE、ESM 与 TypeScript 声明。
5. 运行 H5 SDK 17 个 Node 单元测试。
6. 执行 `npm pack --dry-run --ignore-scripts` 预览候选包。
7. 检查 package 路径、ESM 导出和 IIFE 全局挂载。

workflow 文件位于 `.github/workflows/ci.yml`。配置推送到 GitHub 后才会产生真实运行结果，README badge 也会从该 workflow 读取状态。

## 当前不覆盖

- HarmonyOS HAP 构建与 ArkTS runtime 自动化测试。
- ArkWeb JavaScriptProxy 和 `runJavaScript` 的真实通信。
- Toast、Clipboard、Storage 的真机能力与权限行为。
- Web 容器加载进度、URL Guard、错误页和 DebugPanel UI。
- external consumer 的本地 tarball 安装回归。

GitHub Linux runner 默认不具备 DevEco Studio、HarmonyOS SDK、模拟器和签名环境。为保持第一版 CI 稳定、可理解，本阶段不在 workflow 中强制构建 HAP。

## 手工补充

CI 通过不代表设备功能通过。准备 release 前仍需执行 [HarmonyOS 手工冒烟测试](../testing/manual-smoke-test.md)，并在 [发布回归清单](../testing/release-regression-checklist.md) 中记录环境和结果。

## 后续演进

- 在明确的 HarmonyOS 构建环境中增加 ArkTS 静态检查或 HAP 构建。
- 为 external consumer 增加临时 tarball 安装与轻量 build。
- 为 GitHub Release 自动附加候选构建产物。
- 在人工审批和凭据隔离完成后，再评估 H5 SDK npm publish；当前 workflow 不发布任何包。
