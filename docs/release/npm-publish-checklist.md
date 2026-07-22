# H5 SDK npm 发布检查清单

这篇文档解决什么问题：记录 H5 SDK 首次公开发布的完成状态、仍需保留的安全门和后续版本发布要求。

## 包状态

- [x] 包名为 `@lcy453/miniapp-runtime-harmony-web-sdk`。
- [x] 版本为 `0.1.0`。
- [x] npm registry 回读确认 `latest` 指向 `0.1.0`。
- [x] `private` 为 `false`。
- [x] `publishConfig.access` 为 `public`。
- [x] 根入口为无副作用 ESM，`./iife` 为自动挂载入口。
- [x] package exports、类型声明和实际文件一致。

## 构建与测试

- [x] 根 `npm run check` 通过。
- [x] H5 SDK 24 个单元测试通过。
- [x] `npm pack --dry-run` 通过。
- [x] registry consumer ESM、IIFE、类型检查和 `NATIVE_UNAVAILABLE` 边界通过。
- [x] 独立 React/Vite 工程从 registry 安装 `0.1.0` 并构建通过。
- [x] 本地 HAR 在独立 HarmonyOS Demo 中通过包名导入和 ArkTS 编译。
- [ ] 独立 Demo 配置签名后完成 ArkWeb 真机 API 回归。

## 安全门

- [x] npm token 未写入仓库、日志或 tarball。
- [x] 本次集成未复制签名材料。
- [ ] 对已进入远端历史的 HarmonyOS 签名凭据执行轮换或吊销。
- [ ] 从当前文件移除签名材料并评估 Git 历史清理。
- [ ] 最终 Git commit 和远程 CI 状态确认。

## 后续版本

后续发布必须由项目作者确认版本、身份和安全门，再手动执行：

```bash
cd h5_sdk
npm whoami
npm publish --access public
```

Codex 不自动处理 OTP、不写入 token，也不会在未获得明确授权时执行发布。
