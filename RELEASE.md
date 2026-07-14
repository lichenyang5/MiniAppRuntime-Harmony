# Release Preparation

这篇文档解决什么问题：集中说明当前版本状态、候选发布物和发布前检查流程。

## 当前版本状态

当前候选版本为 `v0.1.0`，状态是 GitHub 展示版准备中。它用于源码阅读、本地构建、Demo 验证和面试讲解。H5 SDK 仍未进入 npm registry，HAR 仍未进入 HarmonyOS 包仓库。

## 候选发布物

- GitHub 源码：ArkTS HAR、H5 SDK、entry Demo、工具和文档。
- Local HAR：通过 `file:../myascf_runtime` 接入的 ArkTS runtime。
- H5 SDK dist：`h5_sdk/dist/` 中的 IIFE `myascf.js`、ESM `index.esm.js`、`index.d.ts`、`myascf.d.ts` 与生成声明文件。
- Docs：架构、API、接入、调试、博客草稿和发布说明。
- Showcase：项目展示、Demo Walkthrough、技术亮点和面试讲解材料。

## 两个包的发布方向

H5 SDK 本质上是普通 JavaScript / TypeScript SDK，可以继续完成 `npm pack` 检查并在合适时发布。当前 `private: true` 用于阻止误发布。

`myascf_runtime` 是 HarmonyOS 本地 HAR 模块，不能简单等同于普通 npm 包。当前优先通过本地 file 依赖和 GitHub 示例展示，后续再调研对应的 HarmonyOS 包管理与发布方式。

## npm Pack 本地预检

H5 SDK `0.1.0` 已完成：

- `npm pack --dry-run`。
- 本地 `.tgz` 生成。
- tarball 公开文件白名单检查。
- `examples/sdk-consumer-demo` 本地安装。
- TypeScript 全局类型编译。
- 普通浏览器 NATIVE_UNAVAILABLE 验证。

本次预检没有执行 npm publish，H5 SDK 继续保持 `private: true`。

## 发布前检查

- [ ] 运行 H5 SDK build 和测试。
- [ ] 同步 SDK dist 到 rawfile，并确认文件一致。
- [ ] 构建完整 HAP。
- [ ] 在模拟器或真机运行 Demo。
- [ ] 回归 Toast、Clipboard、Storage 和 `runtime.getApiList`。
- [ ] 回归 timeout、callback lost 和 DebugPanel。
- [ ] 运行 API 文档生成并检查差异。
- [ ] 更新 README、CHANGELOG 和版本号。
- [x] 检查 LICENSE 与 H5 SDK npm tarball 候选包内容。
- [ ] 检查公开内容不含内部信息或未经验证的能力声明。
- [ ] 确认未把准备状态写成已发布状态。
- [ ] 按 `docs/release/v0.1.0-checklist.md` 完成候选版本验收。
- [ ] 按 `docs/assets/screenshots/README.md` 补充真实设备与 CI 截图。

## v0.1.0 文档

- [Release Notes](docs/release/v0.1.0-release-notes.md)
- [候选验收清单](docs/release/v0.1.0-checklist.md)
- [Demo Walkthrough](docs/showcase/demo-walkthrough.md)
- [Interview Talk Track](docs/showcase/interview-talk-track.md)

## GitHub Release Notes 模板

完整模板见 [docs/release/github-release-template.md](docs/release/github-release-template.md)。发布时应补充真实 commit、构建环境和设备验证结果，并删除尚未完成的项目。
