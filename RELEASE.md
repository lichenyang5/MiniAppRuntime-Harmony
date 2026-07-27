# Release Preparation

这篇文档解决什么问题：集中说明当前版本状态、候选发布物和发布前检查流程。

## 当前版本状态

当前候选版本为 `v0.1.0`，状态是 GitHub Release 准备中。H5 SDK `@lcy453/miniapp-runtime-harmony-web-sdk@0.1.0` 已进入 npm registry 并完成消费验证；HAR 当前通过本地文件和独立 Demo 接入，GitHub Release 与 ohpm 尚未发布。

## 发布阻塞项

签名凭据已经进入公开远端历史。当前工作树中的签名配置已经移除并加入忽略规则，但旧凭据仍必须轮换或吊销，项目作者还需决定是否重写 Git 历史。完成凭据处置、最终 commit 和 CI 复核之前，不得创建 `v0.1.0` tag、GitHub Release 或执行 OHPM publish。

## 候选发布物

- GitHub 源码：ArkTS HAR、H5 SDK、entry Demo、工具和文档。
- Local HAR：通过 `file:../myascf_runtime` 接入的 ArkTS runtime。
- H5 SDK dist：`h5_sdk/dist/` 中的 IIFE `myascf.js`、ESM `index.esm.js`、`index.d.ts`、`myascf.d.ts` 与生成声明文件。
- Docs：架构、API、接入、调试、博客草稿和发布说明。
- Showcase：项目展示、Demo Walkthrough、技术亮点和面试讲解材料。
- Articles：综合掘金文章草稿、发布清单和链接回填入口。

## 两个包的发布方向

H5 SDK 本质上是普通 JavaScript / TypeScript SDK，已使用公开 scoped 包名发布到 npm。后续版本仍必须经过 check、test 和 pack dry-run，再由项目作者确认发布。

`myascf_runtime` 是 HarmonyOS 本地 HAR 模块，不能简单等同于普通 npm 包。当前优先通过本地 file 依赖和 GitHub 示例展示，后续再调研对应的 HarmonyOS 包管理与发布方式。

## npm Pack 本地预检

H5 SDK `0.1.0` 已完成：

- `npm pack --dry-run`。
- 本地 `.tgz` 生成。
- tarball 公开文件白名单检查。
- `examples/sdk-consumer-demo` 本地安装。
- TypeScript 全局类型编译。
- 普通浏览器 NATIVE_UNAVAILABLE 验证。

当前已完成 scoped tgz、独立 consumer、npm registry 安装和 HarmonyOS Demo 构建验证。本次整理不会再次执行 npm publish。

## 发布前检查

- [x] 2026-07-27 运行根检查与 H5 SDK build/test，24/24 tests 通过。
- [x] 2026-07-15 同步 SDK dist 到 rawfile，并确认 copy:demo 成功。
- [x] 2026-07-15 构建 HAP 成功，有 SDK warning，未记录设备启动。
- [ ] 在模拟器或真机运行 Demo。
- [ ] 回归 Toast、Clipboard、Storage 和 `runtime.getApiList`。
- [ ] 回归 timeout、callback lost 和 DebugPanel。
- [x] 运行 API 文档/类型生成一致性检查。
- [x] 更新 README、CHANGELOG、Release 文案和文章草稿；版本仍为 `0.1.0`。
- [x] 检查 LICENSE 与 H5 SDK npm tarball 候选包内容。
- [x] 当前发布表面敏感路径、签名文件和禁止描述静态检查通过。
- [ ] 确认未把准备状态写成已发布状态。
- [ ] 按 `docs/release/v0.1.0-checklist.md` 完成候选版本验收。
- [ ] 按 `docs/assets/screenshots/README.md` 补充真实设备与 CI 截图。
- [x] `9de3f82` 的 [GitHub Actions CI](https://github.com/lichenyang5/MiniAppRuntime-Harmony/actions/runs/29386035145) 通过。
- [x] 从当前公开配置移除签名材料并补充忽略规则。
- [ ] 完成历史签名凭据轮换/吊销，并确认是否重写 Git 历史。
- [ ] 确认最终发布 commit 的 CI 成功。
- [x] 2026-07-27 构建最终 HAR、执行 `ohpm prepublish`、计算 SHA-256，并用独立 Demo 完成消费编译验证。
- [ ] 确认 OHPM 账号、包名、发布码和私钥；`source_type` 固定为 `open`，本次不执行 publish。

## v0.1.0 文档

- [Release Notes](docs/release/v0.1.0-release-notes.md)
- [候选验收清单](docs/release/v0.1.0-checklist.md)
- [Self-check Report](docs/release/v0.1.0-self-check-report.md)
- [Publish Record](docs/release/v0.1.0-publish-record.md)
- [Demo Walkthrough](docs/showcase/demo-walkthrough.md)
- [Interview Talk Track](docs/showcase/interview-talk-track.md)

## GitHub Release Notes 模板

完整模板见 [docs/release/github-release-template.md](docs/release/github-release-template.md)。发布时应补充真实 commit、构建环境和设备验证结果，并删除尚未完成的项目。

## 文章状态

综合掘金文章已整理为 [仓库草稿](docs/articles/juejin-h5-sdk-runtime-framework-design.md)，当前没有公开 URL。文章必须由项目作者手动发布，发布后按 [文章清单](docs/articles/publish-checklist.md) 回填 README、Articles、Showcase 和 Publish Record。
