# H5 SDK npm Publish Checklist

这篇文档解决什么问题：列出 H5 SDK 未来发布 npm 前的检查步骤。当前仍是私有候选包，不执行发布。

## 已完成的本地准备

- [x] IIFE `dist/myascf.js` 可自动挂载 `window.myascf`。
- [x] ESM `dist/index.esm.js` 导出工厂、错误码和类型。
- [x] `dist/index.d.ts` 与 `dist/myascf.d.ts` 存在。
- [x] generated action / params / response 与 typed helper 声明进入候选包。
- [x] `main/module/types/exports` 指向真实文件。
- [x] `npm pack --dry-run` 纳入自动构建和测试。
- [x] 外部 consumer 使用 ESM import 验证本地 tarball。
- [x] 候选包排除源码、测试、脚本和 node_modules。
- [ ] npm publish 未执行。

## Package Metadata

- [ ] 确认 name、version、description、license 与 repository。
- [ ] 确认 npm 包名可用且不会产生品牌混淆。
- [ ] 决定 `main` 保持 IIFE 的兼容策略是否适合首个公开版本。
- [ ] 确认 `exports` 的 import/default/iife 条件满足目标 bundler。
- [ ] 确认 `files` 白名单只包含公开产物和文档。

## Build And Content

- [ ] 执行 `npm --prefix h5_sdk run build`。
- [ ] 执行 `npm --prefix h5_sdk test`。
- [ ] 执行 `npm --prefix h5_sdk run build:demo` 并回归 ArkWeb。
- [ ] 执行 `npm --prefix h5_sdk run pack:check`。
- [ ] 解包 tarball，检查所有 JS 与 d.ts 入口。
- [ ] 在干净 consumer 中重新安装 tarball 并运行类型检查和测试。
- [ ] 检查 README、LICENSE、CHANGELOG 和公开内容。

## Publish Decision

- [ ] 更新版本号和 CHANGELOG，创建对应 Git tag。
- [ ] 移除 `private: true`。
- [ ] 明确发布渠道、访问级别与回滚方式。
- [ ] 最后审批后才执行 `npm publish`。

任何一项未确认时都保持当前本地预检状态。
