# 发布回归清单

这篇文档解决什么问题：在准备 GitHub Release、H5 SDK 候选包或 HAR 交付前，统一检查代码、生成物、示例、文档和公开边界。

v0.1.0 展示候选版还需同步完成 [版本专属验收清单](../release/v0.1.0-checklist.md)。

## 自动检查

- [ ] 本次 commit 对应的 GitHub Actions CI 已通过。
- [ ] 已确认 CI 通过不等于真机功能通过，并继续执行完整 manual smoke test。
- [ ] 根目录执行 `npm run check` 成功。
- [ ] `npm run check:generated` 确认文档和类型生成物未过期。
- [ ] `npm run check:api` 确认 Manifest、ActionNames、ApiManifest 与 RuntimeBootstrap 对齐。
- [ ] `npm run check:package` 确认 package exports 指向真实文件。
- [ ] `npm --prefix h5_sdk run check` 完成 build、test 和 `npm pack --dry-run`。
- [ ] H5 SDK 17 个单元测试全部通过。

## HarmonyOS 回归

- [ ] 按 [手工冒烟测试](manual-smoke-test.md) 完整执行并保留环境信息。
- [ ] `entry` HAP 可以构建。
- [ ] entry Demo 在目标设备启动并跑通 Toast、Clipboard、Storage、`network.request` 和 `runtime.getApiList`。
- [ ] Network GET/POST、JSON/text、非法协议、断网、双 timeout 与 HTTP 4xx/5xx 策略已验证。
- [ ] Network 日志和 DebugPanel 不泄露 query、Authorization、Cookie 或完整 body。
- [ ] DebugPanel、URL Guard、错误页和重试行为正常。
- [ ] 外部 Demo 可以导入 `myascf_runtime` HAR 并暴露 `MyASCFRuntime` proxy。

## H5 SDK 候选包

- [ ] IIFE rawfile Demo 使用最新构建产物。
- [ ] ESM consumer 使用本次候选 tarball 重新安装并测试。
- [ ] pack 内容包含 `dist/myascf.js`、`dist/index.esm.js` 和 d.ts。
- [ ] pack 内容不包含 `src`、`tests`、`scripts` 或 `node_modules`。
- [ ] package version、CHANGELOG 和 release version 一致。
- [ ] `private: true` 的当前发布边界保持不变。

## 文档与合规

- [ ] README、docs 首页、Roadmap、API 表格和使用示例已更新。
- [ ] generated 文件由脚本生成，没有手工修改。
- [ ] 新增或变更行为有对应测试与文档。
- [ ] 文档只描述本仓库实现和公开 HarmonyOS 能力。
- [ ] 不包含公司内部信息、内部命名或不可公开材料。
- [ ] 不夸大为完整小程序平台或生产级 SDK。
- [ ] 本阶段没有执行 `npm publish` 或 ohpm 发布。

## 发布记录

- 候选版本：`__________`
- Commit：`__________`
- 自动检查结果：`__________`
- 冒烟记录链接：`__________`
- 已知限制：`__________`
